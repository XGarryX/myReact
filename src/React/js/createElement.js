export default function createElement(tag, attrs, ...children) {
    return {
        tag,
        attrs: attrs || {},
        children: flatArr(children)
    }
}

function flatArr(arr) {
    return Array.prototype.concat.apply([], arr)
}