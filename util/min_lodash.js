// I only needed one lodash function so I just put it here to avoid accessing the cdn constantly
// and allow offline use


copyArray = function(source, array) {
    let index = -1
    const length = source.length
    
    array || (array = new Array(length))
    while (++index < length) {
        array[index] = source[index]
    }
    return array
}
shuffle = function(array) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    let index = -1
    const lastIndex = length - 1
    const result = copyArray(array)
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = result[rand]
        result[rand] = result[index]
        result[index] = value
    }
    return result
}
