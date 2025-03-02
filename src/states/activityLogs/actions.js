import {GET_ACTIVITY_LOGS_INFO_LOADING, GET_ACTIVITY_LOGS_INFO_SUCCESS, GET_ACTIVITY_LOGS_INFO_FAILURE } from './types'


const getActivityLogInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('activitylogs')
    return await response.data
}

export const fetchActivityLogs = ()  => {
    return async dispatch => {
            dispatch(fetchActivityLogInfoLoading());
        try {
            const aog = await getActivityLogInfo();
            dispatch(fetchActivityLogInfoSuccess(aog));
        } catch{
            dispatch(fetchActivityLogInfoFailure());
        }
    }
}

export const fetchActivityLogInfoLoading = () => ({type: GET_ACTIVITY_LOGS_INFO_LOADING})
export const fetchActivityLogInfoSuccess = (payload) => ({type: GET_ACTIVITY_LOGS_INFO_SUCCESS, payload })
export const fetchActivityLogInfoFailure = () => ({type: GET_ACTIVITY_LOGS_INFO_FAILURE})