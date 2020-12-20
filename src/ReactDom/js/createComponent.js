import React from '../../React'

export default function (component, props) {
    let com

    if(Object.getPrototypeOf(component) == React.Component){
        com = new component(props)
    } else {
        com = new React.Component(props)
        com.constructor = component
        com.render = function () {
            return this.constructor(props)
        }
    }

    return com
}