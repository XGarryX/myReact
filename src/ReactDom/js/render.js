import setProps from './setProps'
import renderComponent from './renderComponent'
import { Component } from '../../React'

export default function render(vdom, container) {
    return container.appendChild(createElement(vdom))
}

export function createElement(vdom, constructor) {
    if(typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }

    let { tag, props, children } = vdom

    if(typeof tag === 'function') {
        props = Object.assign({}, props, {
            children
        })

        if(Object.getPrototypeOf(tag) === Component) {
            let component = new tag(props)

            component.props = props

            return renderComponent(component)
        } else {
            vdom = tag(props)
            
            if(props.key !== undefined) {
                vdom.props.key = props.key
            }

            return createElement(vdom, tag)
        }
    }

    let elm = document.createElement(tag)

    if(constructor) {
        elm._componentConstructor = constructor
    }

    setProps(elm, props)

    children.forEach(child => render(child, elm))

    return elm
}