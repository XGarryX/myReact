export const ATTR_KEY = '__preprops_'

export function setAttribute(elm, name, value) {
    if(name === 'className') name = 'class'

    if(/on\w+/.test(name)){
        name = name.toLowerCase()
        elm[name] = value
    } else if (name in elm) {
        elm[name] = value
    } else if (name == 'style') {
        if(!value || typeof value === 'string') {
            elm.style.cssText = value || ''
        } else if(typeof value === 'object') {
            for(let name in value) {
                elm.style[name] = value[name]
            }
        }
    } else if(value) {
        elm.setAttribute(name, value)
    } else {
        elm.removeAttribute(name)
    }
}

export default function setProps(elm, props) {
    elm[ATTR_KEY] = props

    for(let name in props) {
        setAttribute(elm, name, props[name])
    }
}