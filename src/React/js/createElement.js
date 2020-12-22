export default function createElement(tag, props, ...children) {
    return {
        tag,
        props: props || {},
        children: flatArr(children)
    }
}

function flatArr(arr) {
    return Array.prototype.concat.apply([], arr)
}