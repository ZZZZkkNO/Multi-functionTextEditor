import {useEffect, useRef} from 'react'
import styles from '../styles/EditArea.module.css'
import action from '../store/actions'
import { connect } from 'react-redux'
import * as React from 'react'
//EditArea组件
const EditArea = React.forwardRef(function(props, ref){
    const anchorOffset = useRef(null)
    const {mainBodyList, title, input, enter, backspace, focus } = props
    // const titleitem = useRef(null)
    const flag = useRef(null)
    const prefetchInput = useRef(false)//预输入标志（对中文输入input、按键事件等处理）
    //向父组件传递flag标志（表示其他事件响应中）
    React.useImperativeHandle(ref, () => ({
        'flag': flag,
        changeFlag: () => {
            flag.current = true
        }
    }))
    //输入处理
    const inputHandle = (e) => {
        let type = e.nativeEvent.inputType
        if( type === 'deleteContentBackward' || prefetchInput.current === true) return 
        flag.current = true
        anchorOffset.current =  window.getSelection().anchorOffset
        input({id: e.target.id, context: e.target.textContent})
    }
    //换行、退格处理
    const keyDownEnter = (e) => {
        if(flag.current === true){
            e.preventDefault() 
            return
        }
        if(e.code === 'Enter' || e.code === 'NumpadEnter'){
            e.preventDefault()
            if(prefetchInput.current === true){
                prefetchInput.current = false
                return
            }
            flag.current = true
            anchorOffset.current =  window.getSelection().anchorOffset
            enter({id: e.target.id, start: anchorOffset.current})
            anchorOffset.current = 0
        }
    }
    const keyDownBackspace = (e) => {
        if(flag.current === true) return
        if(e.code === 'Backspace'){
            e.preventDefault()
            if( prefetchInput.current === true) return
            flag.current = true
            if(anchorOffset.current === 0 && e.target.parentElement.childElementCount === 1){
                return 
            }else if(anchorOffset.current === 0 && e.target.textContent.length !== 0 && e.target.parentElement.firstChild === e.target){
                return 
            }else if(anchorOffset.current === 0 && e.target.parentElement.firstChild === e.target){
                flag.current = true
                anchorOffset.current = e.target.nextSibling.textContent.length
            }else if(anchorOffset.current === 0){
                flag.current = true
                anchorOffset.current = e.target.previousSibling.textContent.length
            }else{
                flag.current = true
                anchorOffset.current =  (window.getSelection().anchorOffset) - 1
            }
            backspace({id: e.target.id, anchorOffset: window.getSelection().anchorOffset})
        }
    }
    //聚焦处理
    const handleFocus = (e) => {
        let selDom = document.querySelectorAll("[selected='true']")
        if(selDom !== null){
            selDom.forEach(item => item.removeAttribute('selected'))
        }
        if(flag.current === true) return
        flag.current = true
        setTimeout(() => {
            anchorOffset.current = window.getSelection().anchorOffset
            focus({id: e.target.id})
        })
        //聚焦事件：光标位置计算行为的任务优先级经测试比微队列低，因此将任务推进计时队列确保拿到最新的光标位置，否则按同步执行拿到的光标位置为上一次的位置       
    }
    //预输入处理
    const prefetchStart = (e) => {
        prefetchInput.current = true
    }
    const prefetchEnd = (e) => {
        prefetchInput.current = false
        anchorOffset.current =  window.getSelection().anchorOffset
        input({id: e.target.id, context: e.target.textContent})
    }
    //点击处理
    const handleClick = (e) => {
        e.stopPropagation()
        if(flag.current === true) return
        anchorOffset.current = window.getSelection().anchorOffset
    }
    //重新渲染焦点处理
    useEffect(() => {
        flag.current = false
        let prevActiveDom = document.querySelector("div[datafocus = 'true']")
        if(prevActiveDom === null){
            return
        }else{
            // prevActiveDom.focus()
            // if(prevActiveDom.textContent.length < anchorOffset){
            //     window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , prevActiveDom.textContent.length)
            // }else{
            //     window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , 
            //     prevActiveDom.textContent === "" ? 0 : anchorOffset.current  === 0 ? prevActiveDom.textContent.length : anchorOffset.current)
            // }
            window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , anchorOffset.current)
        }
    })

    return<div id='main-box'>
        {title.map(item => {
            return <item.tag {...item.prop} className={styles.titlearea} suppressContentEditableWarning>{item.context}</item.tag>
        })}
        <hr className={styles['hr-solid']}></hr>
        <div className={styles['content-area']} 
            onInput={inputHandle} 
            onKeyDown={(e) => {keyDownEnter(e); keyDownBackspace(e)}} 
            onFocus={handleFocus} 
            onCompositionStart={prefetchStart} 
            onCompositionEnd={prefetchEnd}
            onClick={handleClick}>
            {mainBodyList.map(item => {
                return <item.tag {...item.prop} className={styles.block} suppressContentEditableWarning>{item.context}</item.tag>
            })}
        </div>
    </div>
})

export default connect( state => state.edit, action.edit, null, { forwardRef: true })(EditArea) 