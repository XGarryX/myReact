import React from '../React'

function Todo(props) {
    return (
        <li style={{ color: props.todo.complate ? '#00965e' : '#000' }} onClick={props.toggle}>{ props.todo.text }</li>
    )
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            todoList: []
        }
    }

    //这里还未实现受控组件功能，先用input事件代替
    handleInput(value) {
        this.setState({
            value
        })
    }
    
    handleClick() {
        let todoList = this.state.todoList.concat({
            id: Date.now(),
            text: this.state.value
        })
        this.setState({
            todoList,
            value: ''
        })
    }

    toggle(index) {
        let oldList = this.state.todoList
        let todoList = [
            ...oldList.slice(0, index),
            Object.assign(oldList[index], {
                complate: !oldList[index].complate
            }),
            ...oldList.slice(index + 1, oldList.length)
        ]
        this.setState({
            todoList
        })
    }

    render() {
        return (
            <div>
                <p>
                    <input value={this.state.value} onInput={e => this.handleInput(e.target.value.trim())}/>
                    <button onClick={() => this.handleClick()}>Add Task</button>
                </p>
                <ul>
                    {
                        this.state.todoList.map((todo, index) => {
                            return <Todo key={todo.id} todo={todo} toggle={() => this.toggle(index)} />
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default TodoApp