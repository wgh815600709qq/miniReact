// 更新产生的vdom 跟 真实dom 对比
function diff(newVDom, parent, index=0) {
    
    const element = parent.childNodes[index];

    // 新建node
    if (element == undefined) {
        parent.appendChild(createElement(newVDom));
        return;
    }

    // 删除node
    if (newVDom == undefined) {
        parent.removeChild(element);
        return;
    }

    // 替换node
    if (!isSameNodeType(element, newVDom)) {
        parent.replaceChild(createElement(newVDom), element);
        return;
    }

    // 更新node
    if (element.nodeType === Node.ELEMENT_NODE) {
        // 比较props的变化
        diffProps(newVDom, element);

        // 比较children的变化
        diffChildren(newVDom, element);
    }
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

function diffChildren(oldVDom, newVDom, parent) {
    // 获取子元素最大长度
    const childLength = Math.max(oldVDom.children.length, newVDom.children.length);

    // 遍历并diff子元素
    for (let i = 0; i < childLength; i++) {
        diff(oldVDom.children[i], newVDom.children[i], parent, i);
    }
}



export {
    diff
}