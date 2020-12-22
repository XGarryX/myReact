import setProps from './setProps'
import createComponent from './createComponent'
import setComponentProps from './setComponentProps'

export default function render(vdom, container) {
    return container.appendChild(createElement(vdom))
}

export function createElement(vdom) {
    if(typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }

    if(typeof vdom.tag === 'function') {
        let props = Object.assign({}, vdom.props, {
            children: vdom.children
        })

        let component = createComponent(vdom.tag, props)

        setComponentProps(component, props)

        return component.base
    }

    let elm = document.createElement(vdom.tag)

    setProps(elm, vdom.props)

    vdom.children.forEach(child => render(child, elm))

    return elm
}