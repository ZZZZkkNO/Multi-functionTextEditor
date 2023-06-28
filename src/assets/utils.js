//创建正文block
const createBlock = (tag, prop, context='') => {
    return { tag: tag, prop: prop, context: context}
}
//防抖
const debounce = function(fn, wait, immediateFn = () => {}){
    immediateFn()
    let timer = null
    return function(){
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, wait)
    }
}
//nanoid
let urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
const nanoid = function(size = 21){
    let id = ''
     let i = size
     while (i--) {
        id += urlAlphabet[(Math.random() * 64) | 0]
    }
    return id
}

const cloneDeep = (source, hash = new WeakMap()) => {
    if(typeof source !== 'object' || source === null){
        return source
    }
    if(hash.get(source)){
        return source
    }else{
        hash.set(source, true)
    }
    if(source instanceof Date){
        return new source.constructor(source.getTime())
    }
    if(source instanceof RegExp){
        return new source.constructor(source)
    }
    if(source instanceof Error){
        return new source.constructor(source.message)
    }
    if(source instanceof Function){
        let clone = source.bind({})
        return clone
    }
    if(source instanceof Map){
        return new Map(Array.from(source, ([key, value]) => [cloneDeep(key), cloneDeep(value)]))
    }
    if(source instanceof Set){
        return new Set(Array.from(source, item => cloneDeep(item)))
    }
    let ans = Array.isArray(source) ? [] : {}
    for(let key in source){
        if(source.hasOwnProperty(key)){
            ans[key] = cloneDeep(source[key])
        }
    }
    return ans
}

export {
    nanoid,
    createBlock,
    debounce,
    cloneDeep
}