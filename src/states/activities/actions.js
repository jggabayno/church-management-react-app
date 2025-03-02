import {
    GET_ACTIVITIES_INFO_LOADING, GET_ACTIVITIES_INFO_SUCCESS, GET_ACTIVITIES_INFO_FAILURE,
    ADD_ACTIVITY_INFO_LOADING, ADD_ACTIVITY_INFO_SUCCESS, ADD_ACTIVITY_INFO_FAILURE,
    UPDATE_ACTIVITY_INFO_LOADING, UPDATE_ACTIVITY_INFO_SUCCESS, UPDATE_ACTIVITY_INFO_FAILURE,
    DELETE_ACTIVITY_INFO_LOADING, DELETE_ACTIVITY_INFO_SUCCESS, DELETE_ACTIVITY_INFO_FAILURE
} from './types'

const getActivityInfo = async () => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('activities')
    return await response.data
}

export const fetchActivities = () => {
    return async dispatch => {
        dispatch(fetchActivitiesInfoLoading());
        try {
            const data = await getActivityInfo();
            dispatch(fetchActivitiesInfoSuccess(data));
        } catch {
            dispatch(fetchActivitiesInfoFailure());
        }
    }
}

export const fetchActivitiesInfoLoading = () => ({ type: GET_ACTIVITIES_INFO_LOADING })
export const fetchActivitiesInfoSuccess = (payload) => ({ type: GET_ACTIVITIES_INFO_SUCCESS, payload })
export const fetchActivitiesInfoFailure = () => ({ type: GET_ACTIVITIES_INFO_FAILURE })

// CREATE
export const addActivity = (activity, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addActivityInfoLoading());

        try {

            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('activities', activity)
            const data = await response.data

            Promise.all([
                dispatch(addActivityInfoSuccess(data)),
                message.success(`${data.agenda} created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addActivityInfoFailure());

        }
    }
}

export const addActivityInfoLoading = () => ({ type: ADD_ACTIVITY_INFO_LOADING })
export const addActivityInfoSuccess = (payload) => ({ type: ADD_ACTIVITY_INFO_SUCCESS, payload })
export const addActivityInfoFailure = () => ({ type: ADD_ACTIVITY_INFO_FAILURE })

// UPDATE
export const updateActivity = (activity, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateActivityInfoLoading());
        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`activities/${activity.id}`, activity)
            const data = await response.data
            Promise.all([
                dispatch(updateActivityInfoSuccess(data)),
                message.info(`${data.agenda} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(updateActivityInfoFailure());

        }
    }
}

export const updateActivityInfoLoading = () => ({ type: UPDATE_ACTIVITY_INFO_LOADING })
export const updateActivityInfoSuccess = (payload) => ({ type: UPDATE_ACTIVITY_INFO_SUCCESS, payload })
export const updateActivityInfoFailure = () => ({ type: UPDATE_ACTIVITY_INFO_FAILURE })

// DELETE
export const deleteActivity = (activity, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(deleteActivityInfoLoading());
        try {

            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`activities/${activity.id}`)

            Promise.all([
                dispatch(deleteActivityInfoSuccess(activity.id)),
                message.warning(`${activity.agenda} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])


        } catch (error) {
            dispatch(deleteActivityInfoFailure());
        }
    }
}

export const deleteActivityInfoLoading = () => ({ type: DELETE_ACTIVITY_INFO_LOADING })
export const deleteActivityInfoSuccess = (payload) => ({ type: DELETE_ACTIVITY_INFO_SUCCESS, payload })
export const deleteActivityInfoFailure = () => ({ type: DELETE_ACTIVITY_INFO_FAILURE })