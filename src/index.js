import React from './React'
import ReactDOM from './ReactDom'
import Counter from './Component/Counter'
import TodoApp from './Component/TodoApp'

ReactDOM.render(
    <div>
        <Counter count={1} />
        <TodoApp />
    </div>,
    document.querySelector('#root')
)