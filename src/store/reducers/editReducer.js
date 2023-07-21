import * as TYPES from '../actionTypes'
import { nanoid, createBlock, cloneDeep } from '../../assets/utils'
//初始值（暂时先写固定，后期从后台请求数据）
const initial = {
    filename: '新建文件(1)',
    mainBodyList: [{
        tag: 'div', 
        prop: {id: nanoid(), key: nanoid(), 'data-focus': false, format: 'h0'}, 
        children: [
            {tag: 'span', prop: {'data-key': nanoid(), 'data-fonttype': 'common', contentEditable: true}, context:''},
        ]
    }],
    title: [{
        tag: 'div', 
        prop: {id: 'title', contentEditable: true, key: nanoid()},
        context: '' 
    }],
    cursorPosition: {}
}

const editReducer = function(state = initial, action){
    switch (action.type) {
        case TYPES.CONTEXT_UPDARE:{
            state =  cloneDeep(state)
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    for(let i of action.eventList){
                        if(i.type === 'input'){
                            let index = mainBodyList.findIndex(item => item.prop.id === i.id)
                            mainBodyList[index].children = i.children
                        }
                        if(i.type === 'deleteSpan'){
                            let index = mainBodyList.findIndex(item => item.prop.id === i.parentTarget)
                            let chilrenIndex = mainBodyList[index].children.findIndex(item => item.prop['data-key'] === i.target)
                            if(mainBodyList.length === 1 && mainBodyList[index].children.length === 1){
                                mainBodyList[index].children[chilrenIndex].context = ''
                                state.cursorPosition['target'] = mainBodyList[index].children[0].prop['data-key']
                                state.cursorPosition['anchorOffset'] = 0
                            }else{
                                mainBodyList[index].children.splice(chilrenIndex, 1)
                                if(mainBodyList[index].children[chilrenIndex - 1] !== undefined){
                                    state.cursorPosition['target'] = mainBodyList[index].children[chilrenIndex - 1].prop['data-key']
                                    state.cursorPosition['anchorOffset'] = mainBodyList[index].children[chilrenIndex - 1].context.length
                                }else{
                                    if(mainBodyList[index].children[chilrenIndex] !== undefined){
                                        state.cursorPosition['target'] = mainBodyList[index].children[chilrenIndex].prop['data-key']
                                        state.cursorPosition['anchorOffset'] = 0
                                    }
                                }
                            }
                            if(mainBodyList[index].children.length === 0){
                                let len = mainBodyList[index - 1].children.length
                                mainBodyList.splice(index, 1)
                                mainBodyList[index - 1].prop['data-focus'] = true
                                state.cursorPosition['target'] = mainBodyList[index - 1].children[len - 1].prop['data-key']
                                state.cursorPosition['anchorOffset'] = mainBodyList[index - 1].children[len - 1].context.length
                            }

                        }
                        if(i.type === 'newWrap'){
                            let index = mainBodyList.findIndex(item => item.prop.id === i.parentTarget)
                            let chilrenIndex = mainBodyList[index].children.findIndex(item => item.prop['data-key'] === i.target)
                            let range = i.range
                            mainBodyList.splice(index + 1, 0, {
                                tag: 'div', 
                                prop: {id: nanoid(), key: nanoid(), 'data-focus': true, format: 'h0'}, 
                                children: [
                                    {tag: 'span', prop: {'data-key': nanoid(), 'data-fonttype': 'common', contentEditable: true}, context:''}
                                ]
                            })
                            mainBodyList[index].prop['data-focus'] = false
                            mainBodyList[index + 1].children[0].context = mainBodyList[index].children[chilrenIndex].context.slice(range)
                            mainBodyList[index].children[chilrenIndex].context = mainBodyList[index].children[chilrenIndex].context.slice(0, range)
                            for(let i = index + 1; i < mainBodyList[index].children.length; i++){
                                mainBodyList[index + 1].children.splice(1, 0, mainBodyList[index].children.pop())
                            }
                            state.cursorPosition['target'] = mainBodyList[index + 1].children[0].prop['data-key']
                            state.cursorPosition['anchorOffset'] = 0
                        }
                        if(i.type === 'focus'){
                            let index = mainBodyList.findIndex(item => item.prop.id === i.target)
                            let prevIndex = mainBodyList.findIndex(item => item.prop['data-focus'] === true)
                            if(prevIndex !== -1){
                                mainBodyList[prevIndex].prop['data-focus'] = false
                            }
                            mainBodyList[index].prop['data-focus'] = true
                        }
                        if(i.type === 'cursorPosition'){
                            state.cursorPosition['target'] = i.target
                            state.cursorPosition['anchorOffset'] = i.anchorOffset
                        }
                        if(i.type === 'concatSpan'){
                            let index = mainBodyList.findIndex(item => item.prop.id === i.parentTarget)
                            if(mainBodyList.length === 1) return
                            for(let i = 0; i < mainBodyList[index].children.length; i++){
                                let len = mainBodyList[index - 1].children.length
                                if(mainBodyList[index].children[i].prop['data-fonttype'] === mainBodyList[index - 1].children[len - 1].prop['data-fonttype'] && i === 0){
                                    mainBodyList[index - 1].children[len - 1].context = mainBodyList[index - 1].children[len - 1].context + mainBodyList[index].children[i].context
                                }else{
                                    mainBodyList[index - 1].children.push(mainBodyList[index].children[i])
                                }
                            }
                            mainBodyList.splice(index, 1)
                        }
                    }
                    return mainBodyList
                })()
            }
        }
        case TYPES.ADD_BLOCK: {
            state =  cloneDeep(state)
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.id === action.id)
                    let prevIndex = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
                    mainBodyList[prevIndex].prop.datafocus = 'false'
                    let newContext = mainBodyList[index].context.substring(action.start)
                    mainBodyList[index].context = mainBodyList[index].context.substring(0, action.start)
                    mainBodyList.splice( index + 1, 0, createBlock('div', {className: action.className ,contentEditable: true, id: nanoid(), key: nanoid(), datafocus: 'true'}, newContext))
                    return mainBodyList
                })()
            }
        }
        case TYPES.BACKSPACE: {
            state =  cloneDeep(state)
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.id === action.id)
                    if(action.anchorOffset === 0 && index === 0 && mainBodyList[index].context.length !== 0){
                        return mainBodyList
                    }else if(action.anchorOffset === 0 && index === 0 && mainBodyList[index].context.length === 0){
                        mainBodyList.splice(index, 1)
                        mainBodyList[index].prop.datafocus = 'true'
                    }else if(action.anchorOffset === 0 && index !== 0){
                        let context = mainBodyList[index].context
                        mainBodyList[index - 1].context = mainBodyList[index - 1].context + context
                        mainBodyList[index - 1].prop.datafocus = 'true'
                        mainBodyList.splice(index, 1)
                    }else{
                        let contextArr = mainBodyList[index].context.split('')
                        contextArr.splice(action.anchorOffset - 1, 1)
                        mainBodyList[index].context = contextArr.join('')
                    }
                    return mainBodyList
                })()
            }
        }
        case TYPES.FOCUS: {
            state =  cloneDeep(state)
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.id === action.id)
                    let prevIndex = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
                    if(prevIndex !== -1){
                        mainBodyList[prevIndex].prop.datafocus = 'false'
                    }
                    mainBodyList[index].prop.datafocus = 'true'
                    return mainBodyList
                })()
            }
        }
        case TYPES.BLUR: {
            state =  cloneDeep(state)
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
                    if(index !== -1){
                        mainBodyList[index].prop.datafocus = 'false'
                    }
                    return mainBodyList
                })()
            }
        }
        case TYPES.ChANGEFILENAME: {
            state = cloneDeep(state)
            state.filename = action.fileName
            return state
        }
        case TYPES.CONTENTFORMAT: {
            state = cloneDeep(state)
            return{
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop['data-focus'] === true)
                    console.log(index)
                    if(index !== -1){
                        mainBodyList[index].prop.format = action.titleformat
                    }
                    return mainBodyList
                })()
            }
        }
        case TYPES.CONTENTALIGN: {
            state = cloneDeep(state)
            return{
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop['data-focus'] === true)
                    if(index !== -1){
                        mainBodyList[index].prop['align'] = action.align
                    }
                    return mainBodyList
                })()
            }
        }
        case TYPES.FONTFORMAT: {
            state = cloneDeep(state)
            return {
                ...state, 
                mainBodyList: (() => {
                    let splitContext = []
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop['data-focus'] === true)
                    let childrenIndex = mainBodyList[index].children.findIndex(item => item.prop['data-key'] === action.startTarget)
                    let type = mainBodyList[index].children[childrenIndex].prop['data-fonttype']
                    splitContext.push(mainBodyList[index].children[childrenIndex].context.substring(0, action.startOffset))
                    splitContext.push(mainBodyList[index].children[childrenIndex].context.substring(action.startOffset, action.endOffset))
                    splitContext.push(mainBodyList[index].children[childrenIndex].context.substring(action.endOffset))
                    mainBodyList[index].children[childrenIndex].context = splitContext[0]
                    mainBodyList[index].children.splice(childrenIndex + 1, 0, {tag: 'span', prop: {'data-key': nanoid(), 'data-fonttype': action.fontType, contentEditable: true}, context: splitContext[1]})
                    if(splitContext[2] !== ''){
                        mainBodyList[index].children.splice(childrenIndex + 2, 0, {tag: 'span', prop: {'data-key': nanoid(), 'data-fonttype': type, contentEditable: true}, context: splitContext[2]})
                    }
                    if(mainBodyList[index].children[childrenIndex].context === ''){
                        mainBodyList[index].children.splice(childrenIndex, 1)
                    }
                    state.cursorPosition['target'] = null
                    return mainBodyList
                })()
            }
        }
        default:
            return state
    }
}

export default editReducer