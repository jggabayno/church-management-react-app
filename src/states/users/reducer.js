import { 
    GET_USERS_INFO_LOADING, GET_USERS_INFO_SUCCESS, GET_USERS_INFO_FAILURE,
    ADD_USER_INFO_LOADING, ADD_USER_INFO_SUCCESS, ADD_USER_INFO_FAILURE,
    UPDATE_USER_INFO_LOADING, UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAILURE,
    DELETE_USER_INFO_LOADING, DELETE_USER_INFO_SUCCESS, DELETE_USER_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_USERS_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_USERS_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_USERS_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_USER_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_USER_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_USER_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_USER_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_USER_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_USER_INFO_SUCCESS:
            const user = action.payload.user
            const userId = user.id
        
            const newPayload = {
                ...user,
                address: [action.payload.user_address]
            }
            
            return {...state, data: [newPayload, ...state.data.filter((user) => user.id !== userId)], isLoading: false, hasError: false};     
        case DELETE_USER_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case DELETE_USER_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case DELETE_USER_INFO_SUCCESS:
            return {...state, data: state.data.filter((user) => user.id !== action.payload), isLoading: false, hasError: false};
        default:
            return state;
   }
}