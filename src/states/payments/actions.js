import { GET_PAYMENTS_INFO_LOADING, GET_PAYMENTS_INFO_SUCCESS, GET_PAYMENTS_INFO_FAILURE } from './types'

const getPaymentsFeeInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('payments')
    return await response.data
}

export const fetchPayments = ()  => {
    return async dispatch => {
            dispatch(fetchPaymentsInfoLoading());
        try {
            const payment = await getPaymentsFeeInfo();
            dispatch(fetchPaymentsInfoSuccess(payment));
        } catch{
            dispatch(fetchPaymentsInfoFailure());
        }
    }
}

export const fetchPaymentsInfoLoading = () => ({type: GET_PAYMENTS_INFO_LOADING})
export const fetchPaymentsInfoSuccess = (payload) => ({type: GET_PAYMENTS_INFO_SUCCESS, payload })
export const fetchPaymentsInfoFailure = () => ({type: GET_PAYMENTS_INFO_FAILURE})