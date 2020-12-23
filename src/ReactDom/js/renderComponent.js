import { createElement } from './render'

export default function createComponent(component) {
    let base

    if(component.base && component.componentWillUpdate) {
        component.componentWillUpdate()
    }

    let vdom = component.render()

    deepMerge(vdom.props, component.props)
    
    base = createElement(vdom)

    if(component.base) {
        component.componentDidUpdate && component.componentDidUpdate()
    } else {
        component.componentDidMount && component.componentDidMount()
    }

    if(component.base && component.base.parentNode) {
        component.base.parentNode.replaceChild(base, component.base)
    }

    component.base = base

    base._component = component
    base._componentConstructor = component.constructor

    return base
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) !== '[object Object]'
}

function deepMerge(obj1, obj2, cache = []) {
    if(!isObject(obj1)) return obj2

    if(!isObject(obj2)) return obj1

    if(cache.indexOf(obj2)) return obj2

    let keys = Object.keys(obj1)

    keys.forEach(function (key) {
        obj1[key] = deepMerge(obj1[key], obj2[key])
    })

    return obj1
}