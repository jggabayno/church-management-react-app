import { 
    GET_BAPTISMS_INFO_LOADING, GET_BAPTISMS_INFO_SUCCESS, GET_BAPTISMS_INFO_FAILURE,
    ADD_BAPTISM_INFO_LOADING, ADD_BAPTISM_INFO_SUCCESS, ADD_BAPTISM_INFO_FAILURE,
    UPDATE_BAPTISM_INFO_LOADING, UPDATE_BAPTISM_INFO_SUCCESS, UPDATE_BAPTISM_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_BAPTISMS_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_BAPTISMS_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_BAPTISMS_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_BAPTISM_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_BAPTISM_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_BAPTISM_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_BAPTISM_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_BAPTISM_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_BAPTISM_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((baptism) => baptism.id !== action.payload.id)], isLoading: false, hasError: false};  
        default:
            return state;
   }
}