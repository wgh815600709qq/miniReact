class Component {
    constructor() {
        this.state = {}
    }

    render() {
        throw Error('The instance extends Component, the instance must achieve "render" method')
    }
}




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