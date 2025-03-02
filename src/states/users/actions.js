import { 
    GET_USERS_INFO_LOADING, GET_USERS_INFO_SUCCESS, GET_USERS_INFO_FAILURE,
    ADD_USER_INFO_LOADING, ADD_USER_INFO_SUCCESS, ADD_USER_INFO_FAILURE,
    UPDATE_USER_INFO_LOADING, UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAILURE,
    DELETE_USER_INFO_LOADING, DELETE_USER_INFO_SUCCESS, DELETE_USER_INFO_FAILURE
 } from './types'

const getUsersInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`users`)
    return await response.data
}

export const fetchUsers = ()  => {
    return async dispatch => {
            dispatch(fetchUserInfoLoading());
        try {
            const user = await getUsersInfo();
            dispatch(fetchUserInfoSuccess(user));
        } catch{
            dispatch(fetchUserInfoFailure());
        }
    }
}

export const fetchUserInfoLoading = () => ({type: GET_USERS_INFO_LOADING})
export const fetchUserInfoSuccess = (payload) => ({type: GET_USERS_INFO_SUCCESS, payload })
export const fetchUserInfoFailure = () => ({type: GET_USERS_INFO_FAILURE})

// CREATE
export const addUser = (user, { message, form, setConfig }) => {

    return async dispatch => {
        dispatch(addUserInfoLoading());

        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('users', user)
            const data = await response.data

            Promise.all([
               dispatch(addUserInfoSuccess({...data.user, address: [data.user_address]})),
                message.success(`Member ${data?.user?.first_name} created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addUserInfoFailure());

        }
    }
}

export const addUserInfoLoading = () => ({type: ADD_USER_INFO_LOADING})
export const addUserInfoSuccess = (payload) => ({type: ADD_USER_INFO_SUCCESS, payload})
export const addUserInfoFailure = () => ({type: ADD_USER_INFO_FAILURE})

// UPDATE
export const updateUser = (user, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateUserInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`users/${user.id}`, user)
            const data = await response.data

            const sendMessage = user?.actionType === 'delete' ?
            message.warning(`${user.first_name} account deleted successfully!`) :
            user?.actionType === 'edit' ? message.info(`${user.first_name} account updated successfully!`)
            : user?.actionType === 'add' ?
            message.success(`${user.first_name} account created successfully!`)
            : message.info(`Member ${user.first_name} updated successfully!`)
            
            Promise.all([
                dispatch(updateUserInfoSuccess(data)),
                sendMessage,
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateUserInfoFailure());

        }
    }
}

export const updateUserInfoLoading = () => ({type: UPDATE_USER_INFO_LOADING})
export const updateUserInfoSuccess = (payload) => ({type: UPDATE_USER_INFO_SUCCESS, payload})
export const updateUserInfoFailure = () => ({type: UPDATE_USER_INFO_FAILURE})

// DELETE
export const deleteUser = (user,{ message, form, setConfig })  => {

    return async dispatch => {
        dispatch(deleteUserInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`users/${user.id}`)
 
            Promise.all([
                dispatch(deleteUserInfoSuccess(user.id)),
                message.warning(`Member ${user.first_name} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteUserInfoFailure());
        }
    }
}

export const deleteUserInfoLoading = () => ({type: DELETE_USER_INFO_LOADING})
export const deleteUserInfoSuccess = (payload) => ({type: DELETE_USER_INFO_SUCCESS, payload})
export const deleteUserInfoFailure = () => ({type: DELETE_USER_INFO_FAILURE})