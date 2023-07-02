import * as TYPES from '../actionTypes'
import { nanoid, createBlock, cloneDeep } from '../../assets/utils'
//初始值（暂时先写固定，后期从后台请求数据）
const initial = {
    filename: '新建文件(1)',
    mainBodyList: [{tag: 'div', prop: {contentEditable: true, id: nanoid(), key: nanoid(), datafocus: 'false', format: 'h0'}, context: ''}],
    title: [{tag: 'div', prop: {id: 'title', contentEditable: true, key: nanoid()},context: '' }]
}

const editReducer = function(state = initial, action){
    switch (action.type) {
        case TYPES.CONTEXT_UPDARE:{
            state =  cloneDeep(state)
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.id === action.id)
                    let prevIndex = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
                    if(prevIndex !== -1){
                        mainBodyList[prevIndex].prop['datafocus'] = 'false'
                    }
                    mainBodyList[index].context = action.context
                    mainBodyList[index].prop['datafocus'] = 'true'
                    return mainBodyList
                })(),
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
                    console.log(action.titleformat)
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
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
                    console.log(action.titleformat)
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
                    if(index !== -1){
                        mainBodyList[index].prop.align = action.align
                    }
                    return mainBodyList
                })()
            }
        }
        default:
            return state
    }
}

export default editReducer