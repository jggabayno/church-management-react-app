import { 
    GET_BAPTISMS_INFO_LOADING, GET_BAPTISMS_INFO_SUCCESS, GET_BAPTISMS_INFO_FAILURE,
    ADD_BAPTISM_INFO_LOADING, ADD_BAPTISM_INFO_SUCCESS, ADD_BAPTISM_INFO_FAILURE,
    UPDATE_BAPTISM_INFO_LOADING, UPDATE_BAPTISM_INFO_SUCCESS, UPDATE_BAPTISM_INFO_FAILURE
 } from './types'

const getBaptismInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('baptisms')
    return await response.data
}

export const fetchBaptisms = ()  => {
    return async dispatch => {
            dispatch(fetchBaptismInfoLoading());
        try {
            const baptisms = await getBaptismInfo();
            dispatch(fetchBaptismInfoSuccess(baptisms));
        } catch{
            dispatch(fetchBaptismInfoFailure());
        }
    }
}

export const fetchBaptismInfoLoading = () => ({type: GET_BAPTISMS_INFO_LOADING})
export const fetchBaptismInfoSuccess = (payload) => ({type: GET_BAPTISMS_INFO_SUCCESS, payload })
export const fetchBaptismInfoFailure = () => ({type: GET_BAPTISMS_INFO_FAILURE})

// CREATE
export const addBaptism = (user, { message, form, setConfig }) => {

    return async dispatch => {
        dispatch(addBaptismInfoLoading());

        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('baptisms', user)
            const data = await response.data

            Promise.all([
               dispatch(addBaptismInfoSuccess(data)),
                // message.success(`${data?.user?.first_name} User created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addBaptismInfoFailure());

        }
    }
}

export const addBaptismInfoLoading = () => ({type: ADD_BAPTISM_INFO_LOADING})
export const addBaptismInfoSuccess = (payload) => ({type: ADD_BAPTISM_INFO_SUCCESS, payload})
export const addBaptismInfoFailure = () => ({type: ADD_BAPTISM_INFO_FAILURE})

// UPDATE
export const updateBaptism = (baptism, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateBaptismInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`baptisms/${baptism.id}`, baptism)
            const data = await response.data

            Promise.all([
                dispatch(updateBaptismInfoSuccess(data)),
                // message.info(`Baptism ${user.first_name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateBaptismInfoFailure());

        }
    }
}

export const updateBaptismInfoLoading = () => ({type: UPDATE_BAPTISM_INFO_LOADING})
export const updateBaptismInfoSuccess = (payload) => ({type: UPDATE_BAPTISM_INFO_SUCCESS, payload})
export const updateBaptismInfoFailure = () => ({type: UPDATE_BAPTISM_INFO_FAILURE})