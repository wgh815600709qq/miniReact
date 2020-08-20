const ATTR_KEY = '__preProps__';
import { vDomToDom, renderComponent, setComponentProps } from './vdom.js';
import { isArray, isNumber, isString, isFunction } from './utils/typeCheck';

// 旧的dom 跟 新的vdom对比
// 返回新的dom
function diff(oldDom, newVdom) {
    // 新增节点
    if (oldDom === null) {
        return vDomToDom(newVdom);
    }
    if (isNumber(newVdom)) {
        newVdom = newVdom.toString(); // 将数字转为字符串统一比较
    }

    if (isString(newVdom)) {            // 文本
        return diffTextDom(oldDom, newVdom);
    }
    
    if (isFunction(newVdom.tag)) { // 组件
        return diffComponent(oldDom, newVdom);
    }
    // 一般的非文本类型节点
    if (oldDom.tag.toLowerCase() != newVdom.tag) {
        return diffCommonDom(oldDom, newVdom);
    }
    // dom 不改变属性
    diffProps(oldDom, newVdom);

    return oldDom
}

function diffProps(oldDom, newVdom) {
    let newProps = newVdom.props;
    let oldProps = oldDom._props;
    // 先把新属性挂上, 也要处理事件
    for (var key in newProps) {
        if (key.substring(0, 2) == 'on') {
            const eventName = key.substring(2).toLowerCase();
            oldDom.addEventListener(eventName, newProps[key].bind(oldDom));
        } else {
            oldDom.setAttribute(key, newProps[key])
        }
    }
    for (var oldKey in oldProps) {
        if (!newVdom.props[oldKey]) {
            if (oldKey.substring(0, 2) == 'on') {
                const eventName = oldKey.substring(2).toLowerCase();
                oldDom.removeEventListener(eventName, newProps[oldKey].bind(oldDom));
            } else {
                oldDom.removeAttribute(oldKey)
            }
        }
    }
}

function diffChild(oldDom, newVdom) {

}

// 非文本的一般组件
function diffCommonDom(oldDom, newVdom) {
    let newDom = document.createElement(newVdom.tag);
    // [...oldDom.childNodes].map(newDom.appendChild) // 子节点直接丢弃
    if (oldDom && oldDom.parentNode) {
        oldDom.parentNode.replaceChild(oldDom, newDom);
    }
    return newDom
}

// 组件
function diffComponent(oldDom, newVdom) {
    // 新旧组件不一致
    if (oldDom._component && oldDom._component.constructor != newVdom.tag) {
        const newDom = vDomToDom(newVdom);
        oldDom.parentNode.insertBefore(newDom, oldDom);
        // 旧组件的销毁生命周期
        if (oldDom._component.componentWillUnmount) {
            oldDom._component.componentWillUnmount();
        }
        oldDom.parentNode.removeChild(oldDom);
        return newDom
    } else {
        setComponentProps(oldDom._component, newVdom.props);
        renderComponent(oldDom._component);
        return oldDom
    }
}


// 文本节点
function diffTextDom(oldDom, newVdom) {
    let dom = oldDom;
    if (oldDom && oldDom.nodeType === 3) { // 旧节点为文本节点, 前后节点类型一致，替换内容
        oldDom.textContent = newVdom;
    } else { // 前后节点类型不一致, 替换child
        dom = document.createTextNode(newVdom);
        if (oldDom && oldDom.parentNode) {
            oldDom.parentNode.replaceChild(dom, oldDom);
        }
    }
    return dom;
}


// 判断 dom 与 vdom 的节点类型是否相同
function isSameNodeType(dom, vdom) {
    if (vdom === null) { return false }
    if ((isNumber(vdom) || isString(vdom))) { // 判断是否为文本类型
        return dom.nodeType === 3
    }
    if (dom.nodeName.toLowerCase() === vdom.nodeName) { // 判断非文本类型的 dom
        return true
    }
    if (isFunction(vdom.nodeName)) { // 判断组件类型是否相同
        return dom._component && dom._component.constructor === vdom.nodeName
    }
    return false
}

export {
    diff
}