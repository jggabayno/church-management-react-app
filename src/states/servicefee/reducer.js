import { 
    GET_SERVICEFEES_INFO_LOADING, GET_SERVICEFEES_INFO_SUCCESS, GET_SERVICEFEES_INFO_FAILURE,
    ADD_SERVICEFEE_INFO_LOADING, ADD_SERVICEFEE_INFO_SUCCESS, ADD_SERVICEFEE_INFO_FAILURE,
    UPDATE_SERVICEFEE_INFO_LOADING, UPDATE_SERVICEFEE_INFO_FAILURE, UPDATE_SERVICEFEE_INFO_SUCCESS
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_SERVICEFEES_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_SERVICEFEES_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_SERVICEFEES_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_SERVICEFEE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_SERVICEFEE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_SERVICEFEE_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_SERVICEFEE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_SERVICEFEE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_SERVICEFEE_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((aog) => aog.id !== action.payload.id)], isLoading: false, hasError: false};     
        default:
            return state;
   }
}