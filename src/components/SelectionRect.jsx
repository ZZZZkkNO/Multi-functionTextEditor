import React from "react";
import styles from '../styles/SelectionRect.module.css'
class SelectionRect extends React.Component{
    constructor(props){
        super(props)
        this.startX = null
        this.startY = null
        this.endX = null
        this.endY = null
        this.isMouseDown = false
        this.container = React.createRef()
        this.rect = React.createRef()
    }

    handleMouseDown(e){
        this.startX = e.pageX
        this.startY = e.pageY
        this.isMouseDown= true
        this.container.current.style['z-index'] = 1001
        this.rect.current.style.cssText = `top: ${this.startY - 64}px; left: ${this.startX}px;width: 0px; height: 0px; display: block`
    }
    handMouseMove(e){
        if(this.isMouseDown === false) return
        this.endX = e.pageX
        this.endY = e.pageY
        this.rect.current.style.top = (Math.min(this.startY, this.endY) - 64) + 'px'
        this.rect.current.style.left = Math.min(this.startX, this.endX) + 'px'
        this.rect.current.style.width = Math.abs(this.endX -this.startX) + 'px'
        this.rect.current.style.height = Math.abs(this.endY -this.startY) + 'px'
        let blockList = document.querySelectorAll("[class*='block']")
        for(let i = 0; i < blockList.length; i++){
            let { left, top, bottom, right } = blockList[i].getBoundingClientRect()
            let { left: Rleft, top: Rtop, bottom: Rbottom, right: Rright } = this.rect.current.getBoundingClientRect()
            if(Rleft < right && left < Rright &&  bottom > Rtop && top < Rbottom){
                blockList[i].setAttribute('selected', true)
            }else{
                blockList[i].removeAttribute('selected')
            }
        }
    }
    handleMouseUp(e){
        this.startX = null
        this.startY = null 
        this.endX = null
        this.endY = null
        this.isMouseDown= false
        this.container.current.removeAttribute('style')
        this.rect.current.removeAttribute('style')
    }

    render(){
        return <div className={styles.container} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handMouseMove.bind(this)} ref={this.container}>
            <div className={styles.rect} ref={this.rect}></div>
        </div>
    }
}

export default SelectionRect