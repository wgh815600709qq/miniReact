import { vDomToDom } from '../mini-react/vdom';

function render (component, container) {
    // 先清空dom
    if (container) container.innerHTML = null;
    const dom = vDomToDom(component);
    if (container) {
        container.appendChild(dom);
    } else {
        throw new Error('function [miniReactDom.render] needs two arguments, the second must be a exist Dom');
    }
}

export default render