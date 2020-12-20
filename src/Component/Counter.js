import React from '../React'

export default class Counter extends React.Component {
    constructor(props) {
        super(props)

        let count = props.count + 1

        this.state = {
            count
        }
    }

    
    componentWillMount() {
        console.log('will mount')
    }

    componentDidMount() {
        console.log('did mount')
    }

    componentWillReceiveProps() {
        console.log('will receive props')
    }

    componentWillUpdate() {
        console.log('will update')
    }

    componentDidUpdate() {
        console.log('did update')
    }

    handleClick() {
        this.setState({
            count: this.state.count + 1
        })
    }

    render() {
        return (
            <div className="counter">
                <span>{ this.state.count }</span>
                <button onClick={() => this.handleClick()}>Click!</button>
            </div>
        )
    }
}