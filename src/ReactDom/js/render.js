import setProps from './setProps'
import setComponentProps from './setComponentProps'
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

            setComponentProps(component, props)

            return renderComponent(component)
        } else {
            return createElement(tag(props), tag)
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