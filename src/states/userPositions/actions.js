import {GET_USER_POSITIONS_INFO_LOADING, GET_USER_POSITIONS_INFO_SUCCESS, GET_USER_POSITIONS_INFO_FAILURE} from './types'
 
const getUserPositionsInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('user/positions')
    return await response.data
}

export const fetchUserPositions = ()  => {
    return async dispatch => {
            dispatch(fetchUserPositionsInfoLoading());
        try {
            const profile = await getUserPositionsInfo();
            dispatch(fetchUserPositionsInfoSuccess(profile));
        } catch{
            dispatch(fetchUserPositionsInfoFailure());
        }
    }
}

export const fetchUserPositionsInfoLoading = () => ({type: GET_USER_POSITIONS_INFO_LOADING})
export const fetchUserPositionsInfoSuccess = (payload) => ({type: GET_USER_POSITIONS_INFO_SUCCESS, payload})
export const fetchUserPositionsInfoFailure = () => ({type: GET_USER_POSITIONS_INFO_FAILURE})