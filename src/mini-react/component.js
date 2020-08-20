const { diff } = require("./diff");

import { diff } from './diff';


class Component {
    constructor(props) {
        this.state = {};
        this.props = props || {};
    }

    setState(newState, cb) {
        this.state = {...this.state, ...newState};
        const vdom = this.render();
        diff(this.dom, vdom);
    }

    forceUpdate() {

    }

    render() {
        throw new Error(`User defined Component should own it's self render method`)
    }
}





export default Component


/**
 *     class A extends Component {
 *          constructor() {
 * 
 *          }
 *          
 *          render() {
 * 
 *          }
 *     }
 */