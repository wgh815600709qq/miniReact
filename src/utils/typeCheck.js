export function isNumber(arg) {
    return typeof arg === 'number'
}

export function isString(arg) {
    return typeof arg === 'string'
}

export function isFunction(arg) {
    return typeof arg === 'function'
}

export function isArray(arg) {
    return Array.isArray(arg)
}