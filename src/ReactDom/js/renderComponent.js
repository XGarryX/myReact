import { createElement } from './render'

export default function createComponent(component) {
    let base

    if(component.base && component.componentWillUpdate) {
        component.componentWillUpdate()
    }

    base = createElement(component.render())
    
    if(component.props.key) {
        base.setAttribute('key', component.props.key)
    }

    if(component.base) {
        component.componentDidUpdate && component.componentDidUpdate()
    } else {
        component.componentDidMount && component.componentDidMount()
    }

    if(component.base && component.base.parentNode) {
        component.base.parentNode.replaceChild(base, component.base)
    }

    component.base = base
}