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
    },
    blur(obj){
        return {
            type: TYPES.BLUR,
            ...obj
        }
    },
    modifyfilename(obj){
        return {
            type: TYPES.ChANGEFILENAME,
            ...obj
        }
    },
    contentFormat(obj){
        return {
            type: TYPES.CONTENTFORMAT,
            ...obj
        }
    },
    contentAlign(obj){
        return {
            type: TYPES.CONTENTALIGN,
            ...obj
        }
    }
}

export default editareaAction