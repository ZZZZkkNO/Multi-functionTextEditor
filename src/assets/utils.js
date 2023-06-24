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

//获取dom

export {
    nanoid,
    createBlock,
    debounce
}