# miniReact


## 参考链接

[Blog](https://github.com/purplebamboo/blog/issues)

## ToDoList:

<details>
  <summary>miniReact</summary>

- [x] 虚拟dom对象(Virtual DOM)

- [x] 虚拟dom差异化算法（diff algorithm）

- [x] 单向数据流渲染（Data Flow）

- [x] 组件生命周期

- [x] 事件处理

- [x] fiber调度 [参考链接](https://segmentfault.com/a/1190000018250127)

</details>


> fiber调度
```
旧版 React 通过递归的方式进行渲染，使用的是 JS 引擎自身的函数调用栈，它会一直执行到栈空为止。

而Fiber实现了自己的组件调用栈，它以链表的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务。实现方式是使用了浏览器的requestIdleCallback这一 API。

官方的解释是这样的：
window.requestIdleCallback()会在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这些延迟触发但关键的事件产生影响。函数一般会按先进先调用的顺序执行，除非函数在浏览器调用它之前就到了它的超时时间。
```
