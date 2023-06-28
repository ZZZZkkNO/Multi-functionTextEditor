import * as TYPES from '../actionTypes'

const editareaAction = {
    input(obj){
        return { 
            type: TYPES.CONTEXT_UPDARE,
            ...obj
        }
    },
    enter(obj){
        return { 
            type: TYPES.ADD_BLOCK,
            ...obj
        }
    },
    backspace(obj){
        return { 
            type: TYPES.BACKSPACE,
            ...obj
        }
    },
    focus(obj){
        return { 
            type: TYPES.FOCUS,
            ...obj
        } 
    }
}

export default editareaAction