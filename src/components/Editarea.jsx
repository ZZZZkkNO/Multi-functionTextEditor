import styles from '../styles/EditArea.module.css'
import action from '../store/actions'
import { connect } from 'react-redux'
import { useEffect, useRef } from 'react'
import { transformDOM } from '../assets/utils'
//EditArea组件
const EditArea = function(props){
    const {mainBodyList, title, updateContext, cursorPosition } = props 
    const editActionQueue = []
    let timer = null
    let isfirstEdit = useRef(true)
    const executeEditActionQueue = (list) => {
        let res = []
        for(let i of list){
            if(i.type === 'input'){
                res.push({type: 'input', id: i.target, children: transformDOM(document.getElementById(i.target))})
            }else{
                res.push(i)
            }
        }
        return res
    }
    const startEdit = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            editActionQueue.push({
                type: 'cursorPosition',
                target: window.getSelection().anchorNode.parentNode.getAttribute('data-key'),
                anchorOffset: window.getSelection().anchorOffset
            })
            updateContext({eventList: executeEditActionQueue(editActionQueue)})
        }, 1000)
    }
    //输入处理 
    const handleInput = (e) => {
        if(e.nativeEvent.inputType === "insertCompositionText") return
        if(editActionQueue.findIndex(item => item.type === 'input' && item.target === e.target.parentElement.id) === -1){
            editActionQueue.push({type: 'input', target: e.target.parentElement.id})
        } 
        if(isfirstEdit.current){
            editActionQueue.push({
                type: 'cursorPosition',
                target: window.getSelection().anchorNode.parentNode.getAttribute('data-key'),
                anchorOffset: window.getSelection().anchorOffset
            })
            isfirstEdit.current = false
            updateContext({eventList: executeEditActionQueue(editActionQueue)})
        }else{
            startEdit()
        }
    }
    const handleCompositionEnd = (e) => {
        if(isfirstEdit.current){
            clearTimeout(timer)
            editActionQueue.push({type: 'input', target: e.target.parentElement.id})
            editActionQueue.push({
                type: 'cursorPosition',
                target: window.getSelection().anchorNode.parentNode.getAttribute('data-key'),
                anchorOffset: window.getSelection().anchorOffset
            })
            isfirstEdit.current = false
            updateContext({eventList: executeEditActionQueue(editActionQueue)})
        }else{
            if(editActionQueue.findIndex(item => item.type === 'input' && item.target === e.target.parentElement.id) === -1){
                editActionQueue.push({type: 'input', target: e.target.parentElement.id})
            }
            startEdit()
        }
    }
    //退格处理
    const handleKeyDown = (e) => {
        if(e.code === 'Backspace'){
            if(e.target === e.target.parentElement.firstChild && window.getSelection().anchorOffset === 0){
                if(e.target.parentElement.parentElement.firstChild === e.target.parentElement) return
                e.preventDefault()
                clearTimeout(timer)
                editActionQueue.push({
                    type: 'concatSpan', 
                    parentTarget: e.target.parentElement.id, 
                })
                updateContext({eventList: executeEditActionQueue(editActionQueue)})
            }else if(e.target.textContent.length <= 1){
                e.preventDefault()
                clearTimeout(timer)
                editActionQueue.push({
                    type: 'deleteSpan', 
                    parentTarget: e.target.parentElement.id, 
                    target: e.target.getAttribute('data-key')
                })
                updateContext({eventList: executeEditActionQueue(editActionQueue)})
            }
        }
        if(e.code === 'Enter'){
            e.preventDefault()
            editActionQueue.push({
                type: 'newWrap', 
                parentTarget: e.target.parentElement.id, 
                target: e.target.getAttribute('data-key'), 
                range: window.getSelection().anchorOffset
            })
            clearTimeout(timer)
            updateContext({eventList: executeEditActionQueue(editActionQueue)})
        }  
    }
    //点击处理
    const handleClick = (e) => {
        if(!e.target.className.includes('block')) return
        e.target.lastChild.focus()
    }
    //聚焦处理
    const handleFocus = (e) => {
        if(e.target.parentElement.getAttribute('data-focus') === 'true') return
        editActionQueue.push({
            type: 'focus',
            target: e.target.parentElement.id
        })
        clearTimeout(timer)
        setTimeout(() => {
            editActionQueue.push({
                type: 'cursorPosition',
                target: e.target.getAttribute('data-key'),
                anchorOffset: window.getSelection().anchorOffset
            })
            updateContext({eventList: executeEditActionQueue(editActionQueue)})
        })
    }
    //重新渲染光标位置处理
    useEffect(() => {
        let dom = document.querySelector("div[data-focus = 'true']")
        if(dom !== null && cursorPosition.target !== null){
            window.getSelection().collapse(
                dom.querySelector(`span[data-key = "${cursorPosition.target}"]`).firstChild === null ? dom.querySelector(`span[data-key = "${cursorPosition.target}"]`) : dom.querySelector(`span[data-key = "${cursorPosition.target}"]`).firstChild, 
                cursorPosition.anchorOffset
            )
            if(dom.textContent === ''){
                isfirstEdit.current = true
            }
        }
    })
    // // const titleitem = useRef(null)
    // const anchorOffset= useRef(0)
    // const flag = useRef(null)
    // console.log(React.$rect)
    // const prefetchInput = useRef(false)//预输入标志（对中文输入input、按键事件等处理）
    // //向父组件传递flag标志（表示其他事件响应中） 
    // React.useImperativeHandle(ref, () => ({
    //     'flag': flag,
    //     changeFlag: () => {
    //         flag.current = true
    //     }
    // }))
    // //输入处理
    // const inputHandle = (e) => {
    //     console.log(e.target)
    //     let type = e.nativeEvent.inputType
    //     if( type === 'deleteContentBackward' || prefetchInput.current === true) return
    //     flag.current = true
    //     anchorOffset.current =  window.getSelection().anchorOffset
    //     setTimeout(() => {
    //         input({id: e.target.id, context: e.target.textContent})
    //     });
    // }
    // //换行、退格处理
    // const keyDownEnter = (e) => {
    //     if(flag.current === true){
    //         e.preventDefault() 
    //         return
    //     }
    //     if(e.code === 'Enter' || e.code === 'NumpadEnter'){
    //         e.preventDefault()
    //         if(prefetchInput.current === true){
    //             prefetchInput.current = false
    //             return
    //         }
    //         flag.current = true
    //         anchorOffset.current =  window.getSelection().anchorOffset
    //         enter({id: e.target.id, start: anchorOffset.current})
    //         anchorOffset.current = 0
    //     }
    // }
    // const keyDownBackspace = (e) => {
    //     if(flag.current === true) return
    //     if(e.code === 'Backspace'){
    //         e.preventDefault()
    //         if( prefetchInput.current === true) return
    //         flag.current = true
    //         if(anchorOffset.current === 0 && e.target.parentElement.childElementCount === 1){
    //             return 
    //         }else if(anchorOffset.current === 0 && e.target.textContent.length !== 0 && e.target.parentElement.firstChild === e.target){
    //             return 
    //         }else if(anchorOffset.current === 0 && e.target.parentElement.firstChild === e.target){
    //             flag.current = true
    //             anchorOffset.current = e.target.nextSibling.textContent.length
    //         }else if(anchorOffset.current === 0){
    //             flag.current = true
    //             anchorOffset.current = e.target.previousSibling.textContent.length
    //         }else{
    //             flag.current = true
    //             anchorOffset.current =  (window.getSelection().anchorOffset) - 1
    //         }
    //         backspace({id: e.target.id, anchorOffset: window.getSelection().anchorOffset})
    //     }
    // }

    // //聚焦处理
    // const handleFocus = (e) => {
    //     console.log('聚焦')
    //     let selDom = document.querySelectorAll("[selected='true']")
    //     if(selDom !== null){
    //         selDom.forEach(item => item.removeAttribute('selected'))
    //     }
    //     if(flag.current === true) return
    //     flag.current = true
    //     setTimeout(() => {
    //         anchorOffset.current = window.getSelection().anchorOffset
    //         focus({id: e.target.id})
    //     })
    //     //聚焦事件：光标位置计算行为的任务优先级经测试比微队列低，因此将任务推进计时队列确保拿到最新的光标位置，否则按同步执行拿到的光标位置为上一次的位置       
    // }
    // //预输入处理
    // const prefetchStart = (e) => {
    //     prefetchInput.current = true
    // }
    // const prefetchEnd = (e) => {
    //     prefetchInput.current = false
    //     anchorOffset.current =  window.getSelection().anchorOffset
    //     input({id: e.target.id, context: e.target.textContent})
    // }
    // //重新渲染焦点处理
    // useEffect(() => {
    //     try {
    //         flag.current = false
    //         let prevActiveDom = document.querySelector("div[datafocus = 'true']")
    //         if(prevActiveDom === null){
    //             return
    //         }else{
    //             // prevActiveDom.focus()
    //             // if(prevActiveDom.textContent.length < anchorOffset){
    //             //     window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , prevActiveDom.textContent.length)
    //             // }else{
    //             //     window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , 
    //             //     prevActiveDom.textContent === "" ? 0 : anchorOffset.current  === 0 ? prevActiveDom.textContent.length : anchorOffset.current)
    //             // }
    //             window.getSelection().collapse(prevActiveDom.firstChild || prevActiveDom , anchorOffset.current)
    //         }
    //     } catch (error) {
    //        console.log(error.message) 
    //     }
    // })

    return<div id='main-box'>
        {title.map(item => {
            return <item.tag {...item.prop} className={styles.titlearea} suppressContentEditableWarning>{item.context}</item.tag>
        })}
        <hr className={styles['hr-solid']}></hr>
        <div className={styles['content-area']} 
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={handleFocus}
        onCompositionEnd={handleCompositionEnd}
        >
            {mainBodyList.map(item => {
                return <item.tag {...item.prop} className={styles.block}>
                    {item.children.map((item, index) => {return <item.tag {...item.prop} key={index} suppressContentEditableWarning>{item.context}</item.tag>})}
                </item.tag>
            })}
        </div>
    </div>
}

export default connect( state => state.edit, action.edit)(EditArea) 