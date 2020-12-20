import { createElement } from './render'
import { ATTR_KEY, setAttribute } from './setProps'

const NODE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
}

export default function diff(dom, newVdom, parent, index) {
    if(dom === undefined) {
        let childNodes = parent.childNodes,
            length = childNodes.length
        dom = createElement(newVdom)
        if(length > 0 && index < length - 1) {
            parent.insertBefore(dom, childNodes[index])
        } else {
            parent.appendChild(dom)
        }
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
        diffProps(dom, newVdom.attrs)

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
            key = vchild.attrs ? vchild.attrs.key : undefined

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