import { 
    GET_WEDDINGS_INFO_LOADING, GET_WEDDINGS_INFO_SUCCESS, GET_WEDDINGS_INFO_FAILURE,
    ADD_WEDDING_INFO_LOADING, ADD_WEDDING_INFO_SUCCESS, ADD_WEDDING_INFO_FAILURE,
    UPDATE_WEDDING_INFO_LOADING, UPDATE_WEDDING_INFO_SUCCESS, UPDATE_WEDDING_INFO_FAILURE
 } from './types'

const getWeddingsInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('weddings')
    return await response.data
}

export const fetchWeddings = ()  => {
    return async dispatch => {
            dispatch(fetchWeddingInfoLoading());
        try {
            const wedding = await getWeddingsInfo();
            dispatch(fetchWeddingInfoSuccess(wedding));
        } catch{
            dispatch(fetchWeddingInfoFailure());
        }
    }
}

export const fetchWeddingInfoLoading = () => ({type: GET_WEDDINGS_INFO_LOADING})
export const fetchWeddingInfoSuccess = (payload) => ({type: GET_WEDDINGS_INFO_SUCCESS, payload })
export const fetchWeddingInfoFailure = () => ({type: GET_WEDDINGS_INFO_FAILURE})

// CREATE
export const addWedding = (wedding, { message, form, setConfig }) => {

    return async dispatch => {
        dispatch(addWeddingInfoLoading());

        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('weddings', wedding)
            const data = await response.data

            Promise.all([
               dispatch(addWeddingInfoSuccess(data)),
                // message.success(`${data?.user?.first_name} User created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addWeddingInfoFailure());

        }
    }
}

export const addWeddingInfoLoading = () => ({type: ADD_WEDDING_INFO_LOADING})
export const addWeddingInfoSuccess = (payload) => ({type: ADD_WEDDING_INFO_SUCCESS, payload})
export const addWeddingInfoFailure = () => ({type: ADD_WEDDING_INFO_FAILURE})

// UPDATE
export const updateWedding = (wedding, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateWeddingInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`weddings/${wedding.id}`, wedding)
            const data = await response.data

            Promise.all([
                dispatch(updateWeddingInfoSuccess(data)),
                // message.info(`User ${user.first_name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateWeddingInfoFailure());

        }
    }
}

export const updateWeddingInfoLoading = () => ({type: UPDATE_WEDDING_INFO_LOADING})
export const updateWeddingInfoSuccess = (payload) => ({type: UPDATE_WEDDING_INFO_SUCCESS, payload})
export const updateWeddingInfoFailure = () => ({type: UPDATE_WEDDING_INFO_FAILURE})