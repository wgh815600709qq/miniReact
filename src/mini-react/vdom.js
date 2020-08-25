import { isFunction, isNumber, isString, isArray } from '../utils/typeCheck';

// 创建dom元素, vdom => dom的过程
function vDomToDom(vdom) {

    // 如果vdom是字符串或者数字类型，则创建文本节点
    if (isString(vdom) || isNumber(vdom)) {
        return document.createTextNode(vdom);
    }
    // 组件
    if (isFunction(vdom.tag)) {
        const component = createComponent(vdom);
        setComponentProps(component, vdom.props);
        // 处理组件的ref=(f) => {}, function的情况
        for (const prop in vdom.props) {
            if (prop === 'ref' && isFunction(vdom.props.ref)) {
                vdom.props.ref(component); // 参数传入
            }
        }
        renderComponent(component);
        return component._dom
    } 

    // 一般的元素类型
    let dom = document.createElement(vdom.tag)
    dom._props = vdom.props // 挂载

    // 属性处理 & 事件处理
    vdom.props && Object.keys(vdom.props).forEach((key) => {
        if (key.substring(0, 2) == 'on') {
            const eventName = key.substring(2).toLowerCase();
            dom.addEventListener(eventName, vdom.props[key].bind(dom));
        } else {
            dom.setAttribute(key, vdom.props[key])
        }
    })

    // 子元素处理
    vdom.children && vdom.children.forEach(vdomChild => {
        if (isArray(vdomChild)) {
            vdomChild.forEach(el => {
                render(el, dom);
            })
        } else {
            render(vdomChild, dom);
        }
    })

    return dom
}

// 组件props
function setComponentProps(component, props) {
    if (props) {
        component.props = props
    }
}

// 构造自定义组件
// tag, key, props, children
function createComponent(vdom) {
    let component = {};
    if (vdom.tag.prototype.render) { // 组件render模式
        component = new vdom.tag(vdom.props);
    } else { // 函数无状态组件
        component.render = function () {
            return vdom.tag(vdom.props)
        }
    }
    if (vdom.tag.defaultProps) { // defaultProps属性
        component.props = Object.assign({}, vdom.nodeName.defaultProps, component.props)
    }
    return component
}

// 渲染更新自定义组件
function renderComponent(component) {
    // _dom 区分是否已经渲染
    // render 之前
    const isRenderedComponent = component._dom
    if (!isRenderedComponent) {
        component.componentWillMount && component.componentWillMount();
    }

    if (isRenderedComponent) {
        componentWillReceiveProps && component.componentWillReceiveProps(component.props);
        if (component.shouldComponentUpdate && component.allowShouldComponentUpdate !== false) {
            const canUpdate = component.shouldComponentUpdate(component.props, component.state);
            if (!canUpdate && canUpdate != undefined) {
                return false // 不更新
            }
        }
        component.componentWillUpdate && component.componentWillUpdate.call(component);
    }
    // render
    const componentRendered = component.render();
    let _dom;
    if (isRenderedComponent) {
        _dom = diff(component._dom, componentRendered);
    } else {
        _dom = vDomToDom(componentRendered);
    }
    // render后
    if (isRenderedComponent) {
        component.componentDidUpdate && component.componentDidUpdate();
    } else {
        component.componentDidMount && component.componentDidMount(); // ToDo 渲染完成后才触发
    }

    // 最后相互挂载
    _dom._component = component;
    component._dom = _dom;
}

// 虚拟vdom => 真实dom 
function render (vdom, container) {
    const dom = vdomToDom(vdom);
    if (container) container.appendChild(dom);
}

// 给一般的节点加上属性
function setProps () {

}

export {
    vDomToDom,
    render,
    createComponent,
    renderComponent,
    setComponentProps,
    setProps
}