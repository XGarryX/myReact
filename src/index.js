import React from './React'
import ReactDOM from './ReactDom'
import Counter from './Component/Counter'

ReactDOM.render(
    <Counter count={1} />,
    document.querySelector('#root')
)