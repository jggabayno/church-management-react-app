import { 
    GET_ACT_OF_GIVINGS_INFO_LOADING, GET_ACT_OF_GIVINGS_INFO_SUCCESS, GET_ACT_OF_GIVINGS_INFO_FAILURE,
    ADD_ACT_OF_GIVING_INFO_LOADING, ADD_ACT_OF_GIVING_INFO_SUCCESS, ADD_ACT_OF_GIVING_INFO_FAILURE,
    UPDATE_ACT_OF_GIVING_INFO_LOADING, UPDATE_ACT_OF_GIVING_INFO_SUCCESS, UPDATE_ACT_OF_GIVING_INFO_FAILURE,
    DELETE_ACT_OF_GIVING_INFO_LOADING, DELETE_ACT_OF_GIVING_INFO_SUCCESS, DELETE_ACT_OF_GIVING_INFO_FAILURE
} from './types'

const getActOfGivingInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('actofgivings')
    return await response.data
}

export const fetchActOfGivings = ()  => {
    return async dispatch => {
            dispatch(fetchActOfGivingInfoLoading());
        try {
            const aog = await getActOfGivingInfo();
            dispatch(fetchActOfGivingInfoSuccess(aog));
        } catch{
            dispatch(fetchActOfGivingInfoFailure());
        }
    }
}

export const fetchActOfGivingInfoLoading = () => ({type: GET_ACT_OF_GIVINGS_INFO_LOADING})
export const fetchActOfGivingInfoSuccess = (payload) => ({type: GET_ACT_OF_GIVINGS_INFO_SUCCESS, payload })
export const fetchActOfGivingInfoFailure = () => ({type: GET_ACT_OF_GIVINGS_INFO_FAILURE})

// CREATE
export const addActOfGiving = (actOfGiving, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addActOfGivingInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('actofgivings', actOfGiving)
            const data = await response.data
 
            Promise.all([
                dispatch(addActOfGivingInfoSuccess(data)),
                message.success(`${data.aog_no} created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addActOfGivingInfoFailure());

        }
    }
}

export const addActOfGivingInfoLoading = () => ({type: ADD_ACT_OF_GIVING_INFO_LOADING})
export const addActOfGivingInfoSuccess = (payload) => ({type: ADD_ACT_OF_GIVING_INFO_SUCCESS, payload})
export const addActOfGivingInfoFailure = () => ({type: ADD_ACT_OF_GIVING_INFO_FAILURE})

// UPDATE
export const updateActOfGiving = (actOfGiving, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateActOfGivingInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`actofgivings/${actOfGiving.id}`, actOfGiving)
            const data = await response.data
            Promise.all([
                dispatch(updateActOfGivingInfoSuccess(data)),
                message.info(`Act of Giving ${data.aog_no} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateActOfGivingInfoFailure());

        }
    }
}

export const updateActOfGivingInfoLoading = () => ({type: UPDATE_ACT_OF_GIVING_INFO_LOADING})
export const updateActOfGivingInfoSuccess = (payload) => ({type: UPDATE_ACT_OF_GIVING_INFO_SUCCESS, payload})
export const updateActOfGivingInfoFailure = () => ({type: UPDATE_ACT_OF_GIVING_INFO_FAILURE})

// DELETE
export const deleteActOfGiving = (actOfGiving,{ message, form, setConfig })  => {
    return async dispatch => {
        dispatch(deleteActOfGivingInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`actofgivings/${actOfGiving.id}`)
 
            Promise.all([
                dispatch(deleteActOfGivingInfoSuccess(actOfGiving.id)),
                message.warning(`Act of Giving ${actOfGiving.aog_no} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteActOfGivingInfoFailure());
        }
    }
}

export const deleteActOfGivingInfoLoading = () => ({type: DELETE_ACT_OF_GIVING_INFO_LOADING})
export const deleteActOfGivingInfoSuccess = (payload) => ({type: DELETE_ACT_OF_GIVING_INFO_SUCCESS, payload})
export const deleteActOfGivingInfoFailure = () => ({type: DELETE_ACT_OF_GIVING_INFO_FAILURE})