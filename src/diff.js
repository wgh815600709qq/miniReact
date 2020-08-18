const ATTR_KEY = '__preProps__'
// 更新产生的vdom 跟 真实dom(parent) 对比, dom为子元素
function diff(dom, newVDom, parent, componentInstance) {
    // 组件
    if (typeof newVDom == 'object' && typeof newVDom.tag == 'function') {
        buildComponentFromVdom(dom, newVDom, parent);
        return false;
    }
    // 新建node
    if (dom == undefined) {
        const node = createElement(newVDom);
        if (componentInstance) {
            node._component = componentInstance;
            node._componentConstructor = componentInstance.constructor;
            componentInstance.dom = node;
        }
        parent.appendChild(node);
        return false;
    }

    // 删除node
    if (newVDom == undefined) {
        parent.removeChild(dom);
        return false;
    }

    // 替换node
    if (!isSameNodeType(dom, newVDom)) {
        parent.replaceChild(createElement(newVDom), dom);
        return false;
    }

    // 更新node
    if (dom.nodeType === Node.ELEMENT_NODE) {
        // 比较props的变化
        diffProps(newVDom, dom);

        // 比较children的变化
        diffChildren(newVDom, dom);
    }

    return true;
}

// 比较元素类型是否相同
function isSameNodeType(element, newVDom) {
    const elmType = element.nodeType;
    const vdomType = typeof newVDom;

    // 当dom元素是文本节点的情况
    if (elmType === Node.TEXT_NODE && 
        (vdomType === 'string' || vdomType === 'number') &&
        element.nodeValue == newVDom
    ) {
       return true; 
    }

    // 当dom元素是普通节点的情况
    if (elmType === Node.ELEMENT_NODE && element.tagName.toLowerCase() == newVDom.tag) {
        return true;
    }

    return false;
}

// 比较props的变化
function diffProps(newVDom, element) {
    let newProps = {...element[ATTR_KEY]};
    const allProps = {...newProps, ...newVDom.props};

    // 获取新旧所有属性名后，再逐一判断新旧属性值
    Object.keys(allProps).forEach((key) => {
            const oldValue = newProps[key];
            const newValue = newVDom.props[key];

            // 删除属性
            if (newValue == undefined) {
                element.removeAttribute(key);
                delete newProps[key];
            } 
            // 更新属性
            else if (oldValue == undefined || oldValue !== newValue) {
                element.setAttribute(key, newValue);
                newProps[key] = newValue;
            }
        }
    )

    // 属性重新赋值
    element[ATTR_KEY] = newProps;
}

// 核心功能： 支持key查找

// 将所有dom子元素分为有key和没key两组;
// 遍历VD子元素，如果VD子元素有key，则去查找有key的分组；如果没key，则去没key的分组找一个类型相同的元素出来
// diff一下，得出是否更新元素的类型;
// 如果是更新元素且子元素不是原来的，则移动元素;
// 最后清理删除没用上的dom子元素
function diffChildren(newVdom, parent) {
    // 含key的子元素集合
    const nodesWithKey = {};
    let nodesWithKeyCount = 0;
    const nodesWithoutKey = [];
    let nodesWithoutKeyCount = 0;
    const childNodes = parent.childNodes,
          nodeLength = childNodes.length,
          vChildren = newVdom.children,
          vLength = vChildren.length;

    // 用于优化没有key子元素的数组遍历
    let min = 0;

    // 分组
    for (let i = 0; i < nodeLength; i++) {
        const child = childNodes[i],
              props = child[ATTR_KEY];
        if (props !== undefined && props.key !== undefined) {
            nodesWithKey[props.key] = child;
            nodesWithKeyCount++;
        } else {
            nodesWithoutKey.push(child);
            nodesWithoutKeyCount++;
        }
    }
    // 遍历vdom的所有子元素
    for (let i = 0; i < vLength; i++) {
        const vChild = vChildren[i],
              vProps = vChild.props;
        let dom;
        let vKey = vProps ? vProps.key : undefined;
        if (vKey !== undefined) {
            // 若对应key的原本存在
            if (nodesWithKeyCount && nodesWithKey[vKey] !== undefined) {
                dom = nodesWithKey[vKey];
                nodesWithKey[vKey] = undefined; // 清空值  delete nodesWithKey[vKey]
                nodesWithKeyCount--;
            }
        } 
        // 如果没有key字段，则找一个类型相同的元素出来比较
        else if (min < nodesWithoutKeyCount) {  // min好比是左指针
            for (let j = 0; j < nodesWithoutKeyCount; j++) {
                const node = nodesWithoutKey[j];
                // 相同类型
                if (node !== undefined && isSameNodeType(node, vChild)) {
                    dom = node;
                    nodesWithoutKey[j] = undefined; // splice?
                    if (j === min) min++;
                    if (j === nodesWithoutKeyCount - 1) nodesWithoutKeyCount--; // 最后一个 ???
                    break;
                }
            }
        }

        // diff返回是否更新元素
        const isUpdate = diff (dom, vChild, parent);

        // 若更新，且不是用一个dom元素，则移动到原先的dom元素之前 ???
        if (isUpdate) {
            const originChild = childNodes[i];
            if (originChild != dom) {
                parent.insertBefore(dom, originChild);
            }
        }
    }
    // 未处理完的带key的dom在原dom移除
    if (nodesWithKeyCount) {
        for (key in nodesWithKey) {
            const node = nodesWithKey[key];
            if (node !== undefined) {
                node.parentNode.removeChild(node);
            }
        } 
    }
    while(min <= nodesWithoutKeyCount) {
        const node = nodesWithoutKey[nodesWithoutKeyCount];
        nodesWithoutKeyCount--;
        if (node !== undefined) {
            node.parentNode.removeChild(node);
        }
    }


    // version 1.0  基础比较

    // 获取子元素最大长度
    // const childLength = Math.max(newVdom.children.length, parent.childNodes.length);

    // 遍历并diff子元素
    // for (let i = 0; i < childLength; i++) {
        // diff(newVdom.children[i], parent.childNodes[i], i);
    // }
}


function buildComponentFromVdom(dom, vdom, parent) {
    const cpnt = vdom.tag;
    if (!typeof cpnt === 'function') {
        throw new Error('vdom is not a component type');
    }

    const props = getVdomProps(vdom);
    let componentInstance = dom && dom._component;

    // 创建组件
    if (componentInstance === undefined) {
        try {
            componentInstance = new cpnt(props);
        } catch(e) {
            throw new Error(`component creation error:${cpnt.name}`);
        }
    } else { // 更新组件
        componentInstance.props = props
    }
    const componentVDom = componentInstance.render();
    diff(dom, componentVDom, parent, componentInstance)
}


function getVdomProps(vdom) {
    const props = vdom.props;
    props.children = vdom.children;
    return props;
}


export {
    diff
}