const { diff } = require("./diff");

import { diff } from './diff';

const LifeCycle =  {
    'componentWillMount': 0,
    'componentDidMount': 1,
    'render': 2,
    'componentWillUpdate': 3,
    'componentDidUpdate': 4,
    'componentWillReceiveProps': 5,
    'shouldComponentUpdate': 6,
    'componentWillUnmount': 7
}
class Component {
    constructor(props) {
        this.state = {};
        this.props = props || {};
    }

    setState(newState, cb) {
        this.state = {...this.state, ...newState};
        const vdom = this.render();
        diff(this.dom, vdom, this.parent);
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