import { diff } from '../../ReactDom'

let paddingRenderComponent = []

class Component {
    constructor(props = {}) {
        this.state = {}
        this.props = props
    }

    setState(newState) {
        this.state = Object.assign({}, this.state, newState)
        enqueueRender(this)
    }
}

function enqueueRender(component) {
    if(paddingRenderComponent.push(component) == 1) {
        Promise.resolve().then(renderComponent)
    }
}

function renderComponent() {
    let renderComponentList = [...new Set(paddingRenderComponent)]

    renderComponentList.forEach(component => {
        diff(component.base, component.render(), component.base.parentNode)
    })

    paddingRenderComponent = []
}

export default Component