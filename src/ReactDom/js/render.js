import setProps from './setProps'
import createComponent from './createComponent'
import setComponentProps from './setComponentProps'

export default function render(vdom, container) {
    return container.appendChild(createElement(vdom))
}

export function createElement(vdom) {
    if(vdom === undefined || vdom === null || typeof vdom === 'boolean') vdom = ''

    if(typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }

    if(typeof vdom.tag === 'function') {
        let component = createComponent(vdom.tag, vdom.attrs)

        setComponentProps(component, vdom.attrs)

        return component.base
    }

    let elm = document.createElement(vdom.tag)

    setProps(elm, vdom.attrs)

    vdom.children.forEach(child => render(child, elm))

    return elm
}