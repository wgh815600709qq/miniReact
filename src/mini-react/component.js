import { isFunction } from '../utils/typeCheck'
import { renderComponent } from './vdom'
import { defer } from '../utils/defer'

function Component(props) {
  this.props = props || {}
  this.state = {}
}

// update the state of component and rerender
Component.prototype.setState = function(updater, cb) {
  asyncRender(updater, this, cb)
}

// force to update
Component.prototype.forceUpdate = function(cb) {
  this.allowShouldComponentUpdate = false
  asyncRender({}, this, cb)
}

let componentArr = []

/**
 * async render
 * @param {*} updater
 * @param {*} component
 * @param {*} cb
 */
function asyncRender(updater, component, cb) {
  if (componentArr.length === 0) {
    defer(() => render())
  }

  if (cb) defer(cb)
  if (isFunction(updater)) {
    updater = updater(component.state, component.props)
  }
  component.state = Object.assign({}, component.state, updater)
  if (componentArr.includes(component)) {
    component.state = Object.assign({}, component.state, updater)
  } else {
    componentArr.push(component)
  }
}

function render() {
  let component
  while (component = componentArr.shift()) {
    renderComponent(component) // rerender
    component.allowShouldComponentUpdate = true
  }
}

export default Component
