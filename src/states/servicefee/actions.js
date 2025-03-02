import {
    GET_SERVICEFEES_INFO_LOADING, GET_SERVICEFEES_INFO_SUCCESS, GET_SERVICEFEES_INFO_FAILURE,
    ADD_SERVICEFEE_INFO_LOADING, ADD_SERVICEFEE_INFO_SUCCESS, ADD_SERVICEFEE_INFO_FAILURE,
    UPDATE_SERVICEFEE_INFO_LOADING, UPDATE_SERVICEFEE_INFO_FAILURE, UPDATE_SERVICEFEE_INFO_SUCCESS
} from './types'

const getServiceFeeInfo = async () => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('servicefee')
    return await response.data
}

export const fetchServiceFee = () => {
    return async dispatch => {
        dispatch(fetchServiceFeeInfoLoading());
        try {
            const serviceFee = await getServiceFeeInfo();
            dispatch(fetchServiceFeeInfoSuccess(serviceFee));
        } catch {
            dispatch(fetchServiceFeeInfoFailure());
        }
    }
}

export const fetchServiceFeeInfoLoading = () => ({ type: GET_SERVICEFEES_INFO_LOADING })
export const fetchServiceFeeInfoSuccess = (payload) => ({ type: GET_SERVICEFEES_INFO_SUCCESS, payload })
export const fetchServiceFeeInfoFailure = () => ({ type: GET_SERVICEFEES_INFO_FAILURE })

// CREATE
export const addServiceFee = (serviceFee, { message, form, setConfig }) => {

    return async dispatch => {
        dispatch(addServiceFeeInfoLoading());

        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('servicefee', serviceFee)
            const data = await response.data

            Promise.all([
                dispatch(addServiceFeeInfoSuccess(data)),
                // message.success(`${data?.user?.first_name} User created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addServiceFeeInfoFailure());

        }
    }
}

export const addServiceFeeInfoLoading = () => ({ type: ADD_SERVICEFEE_INFO_LOADING })
export const addServiceFeeInfoSuccess = (payload) => ({ type: ADD_SERVICEFEE_INFO_SUCCESS, payload })
export const addServiceFeeInfoFailure = () => ({ type: ADD_SERVICEFEE_INFO_FAILURE })


// UPDATE
export const updateServiceFee = (serviceFee, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateServiceFeeInfoLoading());
        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`servicefee/${serviceFee.id}`, serviceFee)
            const data = await response.data
            Promise.all([
                dispatch(updateServiceFeeInfoSuccess(data)),
                // message.info(`Fee Settings ${data.name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(updateServiceFeeInfoFailure());

        }
    }
}

export const updateServiceFeeInfoLoading = () => ({ type: UPDATE_SERVICEFEE_INFO_LOADING })
export const updateServiceFeeInfoSuccess = (payload) => ({ type: UPDATE_SERVICEFEE_INFO_SUCCESS, payload })
export const updateServiceFeeInfoFailure = () => ({ type: UPDATE_SERVICEFEE_INFO_FAILURE })