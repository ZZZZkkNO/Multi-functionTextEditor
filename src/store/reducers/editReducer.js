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
                    mainBodyList.splice( index + 1, 0, createBlock('div', {className: action.className ,contentEditable: true, id: nanoid(), key: nanoid(), datafocus: 'true'}))
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
                    if(mainBodyList[index].context === '' && mainBodyList.length !== 1){
                        if(index === 0){
                            mainBodyList.splice(index, 1)
                            mainBodyList[index].prop.datafocus = 'true'
                        }else{
                            mainBodyList[index - 1].prop.datafocus = 'true'
                        }
                    }else{
                        mainBodyList[index].context = action.context
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
                    console.log(mainBodyList)
                    if(index !== -1){
                        mainBodyList[index].prop.format = action.titleformat
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