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
            timer = null
        }, wait)
    }
}
//节流
const throttle = function(fn, wait, immediateFn = () => {}){
    immediateFn()
    let isRun = true
    return function(){
        if(!isRun) return 
        isRun = false
        setTimeout(() => {
            fn.apply(this, arguments)
            isRun = true
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

//深拷贝
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

const recognizeTargetType = (target) => {
    let typeString = Object.prototype.toString.call(target)
    return typeString.split(' ')[1].replace(']', '')
}

export {
    nanoid,
    createBlock,
    debounce,
    cloneDeep,
    recognizeTargetType,
    throttle
}