import { combineReducers } from 'redux'
import editReducer from './editReducer'
const reducer = combineReducers({
    edit: editReducer
})

export default reducer