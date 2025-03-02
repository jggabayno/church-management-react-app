import { 
    GET_EXPENSES_INFO_LOADING, GET_EXPENSES_INFO_SUCCESS, GET_EXPENSES_INFO_FAILURE,
    ADD_EXPENSE_INFO_LOADING, ADD_EXPENSE_INFO_SUCCESS, ADD_EXPENSE_INFO_FAILURE,
    UPDATE_EXPENSE_INFO_LOADING, UPDATE_EXPENSE_INFO_SUCCESS, UPDATE_EXPENSE_INFO_FAILURE,
    DELETE_EXPENSE_INFO_LOADING, DELETE_EXPENSE_INFO_SUCCESS, DELETE_EXPENSE_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_EXPENSES_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_EXPENSES_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_EXPENSES_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_EXPENSE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_EXPENSE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_EXPENSE_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_EXPENSE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_EXPENSE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_EXPENSE_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((expense) => expense.id !== action.payload.id)], isLoading: false, hasError: false};     
        case DELETE_EXPENSE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case DELETE_EXPENSE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case DELETE_EXPENSE_INFO_SUCCESS:
            return {...state, data: state.data.filter((expense) => expense.id !== action.payload), isLoading: false, hasError: false};
        default:
            return state;
   }
}