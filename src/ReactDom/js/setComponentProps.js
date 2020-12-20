import renderComponent from './renderComponent'

export default function setComponentProps(component, props) {
    if(!component.base) {
        component.componentWillMount && component.componentWillMount()
    } else if(component.componentWillReceiveProps) {
        component.componentWillReceiveProps(props)
    }

    component.props = props

    renderComponent(component)
}