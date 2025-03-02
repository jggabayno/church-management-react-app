import { 
    GET_WEDDINGS_INFO_LOADING, GET_WEDDINGS_INFO_SUCCESS, GET_WEDDINGS_INFO_FAILURE,
    ADD_WEDDING_INFO_LOADING, ADD_WEDDING_INFO_SUCCESS, ADD_WEDDING_INFO_FAILURE,
    UPDATE_WEDDING_INFO_LOADING, UPDATE_WEDDING_INFO_SUCCESS, UPDATE_WEDDING_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_WEDDINGS_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_WEDDINGS_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_WEDDINGS_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_WEDDING_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_WEDDING_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_WEDDING_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_WEDDING_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_WEDDING_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_WEDDING_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((user) => user.id !== action.payload.id)], isLoading: false, hasError: false};
        default:
            return state;
   }
}