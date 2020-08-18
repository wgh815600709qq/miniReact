const { diff } = require("./diff");

import { diff } from './diff';
class Component {
    constructor(props) {
        this.state = {};
        this.props = props;
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
        const vdom = this.render();
        diff(this.dom, vdom, this.parent);
    }

    render() {
        throw new Error('component should define its own render method')
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