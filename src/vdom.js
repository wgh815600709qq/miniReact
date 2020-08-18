const PRE_PROPS = '__preProps__'

// 创建dom元素
function createElement(vdom) {
    // 如果vdom是字符串或者数字类型，则创建文本节点
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return doc.createTextNode(vdom);
    }

    const { tag, props, children } = vdom;

    // 1. 创建元素
    const element = doc.createElement(tag);

    // 2. 属性赋值
    setProps(element, props);

    // 3. 创建子元素
    // appendChild在执行的时候，会检查当前的this是不是dom对象
    children.map(item => {
        appendChild.call(element, createElement(item)); 
    })
    return element;
}

// 属性赋值
function setProps(element, props) {
    element[PRE_PROPS] = props; // vdom的props挂在__preProps__字段
    
    for (let key in props) {
        element.setAttribute(key, props[key]);
    }
}


export {
    createElement
}