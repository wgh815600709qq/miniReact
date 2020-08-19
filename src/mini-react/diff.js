const ATTR_KEY = '__preProps__';
import { vDomToDom } from './vdom.js';
import { isArray, isNumber, isString, isFunction } from './utils/typeCheck';

// 旧的dom 跟 新的vdom对比
// 返回新的dom
function diff(oldDom, newVdom) {
    let newDom = vDomToDom(newVdom);
    // 新增节点
    if (oldDom === null) {
        return newDom;
    }
    
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