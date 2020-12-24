import { Component } from '../../React'
import { createElement } from './render'
import { ATTR_KEY, setAttribute } from './setProps'

const NODE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
}

export default function diff(dom, newVdom, parent, componentInst) {
    if(typeof newVdom == 'object' && typeof newVdom.tag == 'function') {
        let { tag, props, children } = newVdom
        props = Object.assign({}, props, {
            children
        })
        if(Object.getPrototypeOf(tag) == Component) {
            let component = new constructor(props)
            newVdom = component.render()

            if(dom && dom._component) {
                dom._component.props = props
            }

            return diff(dom, newVdom, parent, component)
        } else {
            newVdom = tag(props)

            if(props.key !== undefined) {
                newVdom.props.key = props.key
            }

            return diff(dom, newVdom, parent)
        }
    }

    if(dom === undefined) {
        dom = createElement(newVdom)

        if(componentInst) {
            dom._component = componentInst
            dom._componentConstructor = componentInst.constructor
        }

        parent.appendChild(dom)
        return false
    }

    if(newVdom === undefined) {
        parent.removeChild(dom)
        return false
    }

    if(!isSameType(dom, newVdom)) {
        parent.replaceChild(createElement(newVdom), dom)
        return false
    } 

    if(dom.nodeType === NODE.ELEMENT_NODE) {
        diffProps(dom, newVdom.props)

        diffChildren(newVdom.children, dom)
    }

    return true
}

function diffProps(dom, newProps) {
    let oldProps = dom[ATTR_KEY]
    let allProps = Object.assign({}, oldProps, newProps)

    Object.keys(allProps)
        .forEach(function (name) {
            if(newProps[name] === undefined) {
                setAttribute(dom, name)
            } else if(oldProps[name] !== newProps[name] || oldProps[name] === undefined) {
                setAttribute(dom, name, newProps[name])
            }
        })

    dom[ATTR_KEY] = newProps
}

function diffChildren(vchildren = [], parent) {
    const nodeWithKey = {}

    const nodeWithoutKey = []
    let nodeWithoutKeyCount = 0

    let children = parent.childNodes

    for(let i = 0; i < children.length; i++) {
        let child = children[i],
            props = child[ATTR_KEY]
            
        if(props && props.key != undefined) {
            nodeWithKey[props.key] = child
        } else {
            nodeWithoutKey[nodeWithoutKeyCount++] = child
        }
    }

    let min = 0

    for(let i = 0; i < vchildren.length; i++) {
        let vchild = vchildren[i],
            key = vchild.props ? vchild.props.key : undefined

        let dom

        if(key !== undefined) {
            dom = nodeWithKey[key]
            if(dom) {
                delete nodeWithKey[key]
            }
        } else {
            for(let j = min; j < nodeWithoutKeyCount; j++) {
                const child = nodeWithoutKey[j]
                if(child !== undefined && isSameType(child, vchild)) {
                    dom = child
                    if(min == j) min++
                    if(j == nodeWithoutKeyCount - 1) nodeWithoutKeyCount--
                    break
                }
            }
        }

        let isUpdate = diff(dom, vchild, parent, i)

        if(isUpdate) {
            const oldChild = children[i]
            if(dom !== oldChild) {
                parent.insertBefore(dom, oldChild)
            }
        }
    }

    for(let key in nodeWithKey) {
        parent.removeChild(nodeWithKey[key])
    }

    while(min <= nodeWithoutKeyCount) {
        const child = nodeWithoutKey[nodeWithoutKeyCount--]
        child && child.parentNode.removeChild(child)
    }
}

function isSameType(dom, newVdom) {
    if(typeof newVdom.tag === 'function') {
        return dom._componentConstructor == newVdom.tag
    }

    let elmType = dom.nodeType
    let vdomType = typeof newVdom

    if(
        elmType === NODE.TEXT_NODE &&
        (vdomType === 'string' || vdomType === 'number') &&
        dom.textContent == newVdom
    ) {
        return true
    }

    if(elmType === NODE.ELEMENT_NODE && dom.tagName.toLowerCase() === newVdom.tag) {
        return true
    }

    return false
}