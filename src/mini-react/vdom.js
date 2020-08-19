import { isFunction, isNumber, isString, isArray } from './utils/typeCheck';
const ATTR_KEY = '__preProps__';

// 创建dom元素, vdom => dom的过程
function vDomToDom(vdom) {

    // 如果vdom是字符串或者数字类型，则创建文本节点
    if (isString(vdom) || isNumber(vdom)) {
        return document.createTextNode(vdom);
    }
    // 组件
    if (isFunction(vdom.tag)) {

    } 

    // 一般的元素类型

    // 事件处理

    // 子元素处理

}

// 属性赋值
function setProps(element, props) {
    element[ATTR_KEY] = props; // vdom的props挂在__preProps__字段
    for (let key in props) {
        element.setAttribute(key, props[key]);
    }
}

// 构造自定义组件

function createComponent(vdom) {
    
}

// 渲染更新自定义组件
function renderComponent(vdom) {

}

// 虚拟vdom => 真实dom 
function render (vdom) {
    const dom = vdomToDom(vdom);
    if (container) container.appendChild(dom);
}

export {
    vDomToDom,
    render,
    createComponent,
    renderComponent,
    setProps
}