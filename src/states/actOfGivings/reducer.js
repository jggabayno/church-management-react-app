import { 
    GET_ACT_OF_GIVINGS_INFO_LOADING, GET_ACT_OF_GIVINGS_INFO_SUCCESS, GET_ACT_OF_GIVINGS_INFO_FAILURE,
    ADD_ACT_OF_GIVING_INFO_LOADING, ADD_ACT_OF_GIVING_INFO_SUCCESS, ADD_ACT_OF_GIVING_INFO_FAILURE,
    UPDATE_ACT_OF_GIVING_INFO_LOADING, UPDATE_ACT_OF_GIVING_INFO_SUCCESS, UPDATE_ACT_OF_GIVING_INFO_FAILURE,
    DELETE_ACT_OF_GIVING_INFO_LOADING, DELETE_ACT_OF_GIVING_INFO_SUCCESS, DELETE_ACT_OF_GIVING_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_ACT_OF_GIVINGS_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_ACT_OF_GIVINGS_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_ACT_OF_GIVINGS_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_ACT_OF_GIVING_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_ACT_OF_GIVING_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_ACT_OF_GIVING_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_ACT_OF_GIVING_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_ACT_OF_GIVING_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_ACT_OF_GIVING_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((aog) => aog.id !== action.payload.id)], isLoading: false, hasError: false};     
        case DELETE_ACT_OF_GIVING_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case DELETE_ACT_OF_GIVING_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case DELETE_ACT_OF_GIVING_INFO_SUCCESS:
            return {...state, data: state.data.filter((aog) => aog.id !== action.payload), isLoading: false, hasError: false};
        default:
            return state;
   }
}