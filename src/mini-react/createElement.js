// babel 转义函数
// 目的: jsx => vdom
function createElement(tag, props, ...children) {
    let key;
    if (props && props.key != undefined) {
      key = props.key;
    }
    return {
      props: props || undefined,
      children: children,
      key,
      tag: tag,
    }
}


export default createElement