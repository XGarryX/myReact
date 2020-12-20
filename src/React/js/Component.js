import { diff } from '../../ReactDom'

class Component {
    constructor(props = {}) {
        this.state = {}
        this.props = props
    }

    setState(newState) {
        this.state = Object.assign({}, newState)
        diff(this.base, this.render(), this.base.parentNode)
    }
}

export default Component