import { 
    GET_EXPENSES_INFO_LOADING, GET_EXPENSES_INFO_SUCCESS, GET_EXPENSES_INFO_FAILURE,
    ADD_EXPENSE_INFO_LOADING, ADD_EXPENSE_INFO_SUCCESS, ADD_EXPENSE_INFO_FAILURE,
    UPDATE_EXPENSE_INFO_LOADING, UPDATE_EXPENSE_INFO_SUCCESS, UPDATE_EXPENSE_INFO_FAILURE,
    DELETE_EXPENSE_INFO_LOADING, DELETE_EXPENSE_INFO_SUCCESS, DELETE_EXPENSE_INFO_FAILURE
 } from './types'

const getExpenseInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('expenses')
    return await response.data
}

export const fetchExpenses = ()  => {
    return async dispatch => {
            dispatch(fetchExpenseInfoLoading());
        try {
            const aog = await getExpenseInfo();
            dispatch(fetchExpenseInfoSuccess(aog));
        } catch{
            dispatch(fetchExpenseInfoFailure());
        }
    }
}

export const fetchExpenseInfoLoading = () => ({type: GET_EXPENSES_INFO_LOADING})
export const fetchExpenseInfoSuccess = (payload) => ({type: GET_EXPENSES_INFO_SUCCESS, payload })
export const fetchExpenseInfoFailure = () => ({type: GET_EXPENSES_INFO_FAILURE})

// CREATE
export const addExpense = (expense, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addExpenseInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('expenses', expense)
            const data = await response.data
 
            Promise.all([
                dispatch(addExpenseInfoSuccess(data)),
                message.success(`${data.name} created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addExpenseInfoFailure());

        }
    }
}

export const addExpenseInfoLoading = () => ({type: ADD_EXPENSE_INFO_LOADING})
export const addExpenseInfoSuccess = (payload) => ({type: ADD_EXPENSE_INFO_SUCCESS, payload})
export const addExpenseInfoFailure = () => ({type: ADD_EXPENSE_INFO_FAILURE})

// UPDATE
export const updateExpense = (expense, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateExpenseInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`expenses/${expense.id}`, expense)
            const data = await response.data
            Promise.all([
                dispatch(updateExpenseInfoSuccess(data)),
                message.info(`Expense ${data.name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateExpenseInfoFailure());

        }
    }
}

export const updateExpenseInfoLoading = () => ({type: UPDATE_EXPENSE_INFO_LOADING})
export const updateExpenseInfoSuccess = (payload) => ({type: UPDATE_EXPENSE_INFO_SUCCESS, payload})
export const updateExpenseInfoFailure = () => ({type: UPDATE_EXPENSE_INFO_FAILURE})

// DELETE
export const deleteExpense = (expense,{ message, form, setConfig })  => {
    return async dispatch => {
        dispatch(deleteExpenseInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`expenses/${expense.id}`)
 
            Promise.all([
                dispatch(deleteExpenseInfoSuccess(expense.id)),
                message.warning(`Expense ${expense.name} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteExpenseInfoFailure());
        }
    }
}

export const deleteExpenseInfoLoading = () => ({type: DELETE_EXPENSE_INFO_LOADING})
export const deleteExpenseInfoSuccess = (payload) => ({type: DELETE_EXPENSE_INFO_SUCCESS, payload})
export const deleteExpenseInfoFailure = () => ({type: DELETE_EXPENSE_INFO_FAILURE})