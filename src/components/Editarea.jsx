import {useReducer, useEffect, useRef} from 'react'
import {nanoid, createBlock } from '../assets/utils'
import styles from '../styles/EditArea.module.css'



//正文区域dom,参考虚拟dom的格式
//{tag: xxx标签， prop: xxx 属性， context：xxx 文本内容}
const initialState = {
    mainBodyList: [{tag: 'div', prop: {className: styles.block,contentEditable: true, id: nanoid(), key: nanoid(), datafocus: 'false'}, context: ''}],
    title: [{tag: 'div', prop: {id: 'title', contentEditable: true, className: styles.titlearea, key: nanoid()},context: '' }],
}
const reducer = (state, action) => {
    switch (action.type) {
        case 'contextupdate':{
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
        case 'addblock': {
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.id === action.id)
                    let prevIndex = mainBodyList.findIndex(item => item.prop.datafocus === 'true')
                    mainBodyList[prevIndex].prop.datafocus = 'false'
                    mainBodyList.splice( index + 1, 0, createBlock('div', {className: styles.block,contentEditable: true, id: nanoid(), key: nanoid(), datafocus: 'true'}))
                    return mainBodyList
                })()
            }
        }
        case 'backspace': {
            return {
                ...state,
                mainBodyList: (() => {
                    let mainBodyList = state.mainBodyList
                    let index = mainBodyList.findIndex(item => item.prop.id === action.id)
                    if(action.context === '' && mainBodyList.length !== 1){
                        mainBodyList.splice(index, 1)
                        mainBodyList[index - 1].prop.datafocus = 'true'
                    }else{
                        mainBodyList[index].context = action.context
                    }
                    return mainBodyList
                })()
            }
        }
        case 'focus': {
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
        default:{
            throw Error('Unknown action: ' + action.type)
        }
    }

}

//EditArea组件
function EditArea(){
    const anchorOffset = window.getSelection().anchorOffset
    const [state, dispatch] = useReducer(reducer, initialState)
    const title = useRef(null)
    const flag = useRef(null)
    const prefetchInput = useRef(false)//预输入标志（对中文输入input、按键事件等处理）
    //输入处理
    const inputHandle = (e) => {
        if(e.nativeEvent.inputType === 'deleteContentBackward' || prefetchInput.current === true) return 
        // e.target.blur()
        dispatch({type: 'contextupdate', id: e.target.id, context: e.target.textContent})
    }
    //换行、退格处理
    const keyDownEnter = (e) => {
        if(flag.current === true){
            e.preventDefault()
            return
        }
        if(e.code === 'Enter'){
            if(prefetchInput.current === true){
                prefetchInput.current = false
                return
            }
            dispatch({type: 'addblock', id: e.target.id})
        }
    }
    const keydownBackspace = (e) => {
        if(flag.current === true) return
        if(e.code === 'Backspace'){
            if( prefetchInput.current === true) return 
            dispatch({type: 'backspace', id: e.target.id, context: e.target.textContent})
        }
    }
    //聚焦处理
    const handleFocus = (e) => {
        if(flag.current === true) return
        dispatch({type: 'focus', id: e.target.id})
    }
    //预输入处理
    const prefetchStart = (e) => {
        prefetchInput.current = true
    }
    const prefetchEnd = (e) => {
        prefetchInput.current = false
    }
    //重新渲染焦点处理
    useEffect(() => {
        flag.current = false
        let prevActiveDom = document.querySelector("div[datafocus = 'true']")
        if(prevActiveDom === null){
            title.current.focus()
        }else{
            prevActiveDom.focus()
            if(prevActiveDom.textContent.length - 1 < anchorOffset){
                window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , prevActiveDom.textContent.length)
            }else{
                window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , prevActiveDom.textContent === "" ? 0 : anchorOffset === 0 ? prevActiveDom.textContent.length: anchorOffset)
            }
        }
    })

    return<div id='main-box'>
        {state.title.map(item => {
            return <item.tag {...item.prop} suppressContentEditableWarning ref={title}>{item.context}</item.tag>
        })}
        <hr className={styles['hr-solid']}></hr>
        <div className={styles['content-area']} onInput={inputHandle} onKeyDown={(event) => { keyDownEnter(event); keydownBackspace(event)}} onFocus={handleFocus} onCompositionStart={prefetchStart} onCompositionEnd={prefetchEnd}>
            {state.mainBodyList.map(item => {
                return <item.tag {...item.prop} suppressContentEditableWarning>{item.context}</item.tag>
            })}
        </div>
    </div>
}

export default EditArea 