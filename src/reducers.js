import { combineReducers } from 'redux'

import auth from './states/auth/reducer'
import profile from './states/profile/reducer'
import users from './states/users/reducer'
import userpositions from './states/userPositions/reducer'
import weddings from './states/weddings/reducer'
import baptisms from './states/baptisms/reducer'
import actOfGivings from './states/actOfGivings/reducer'
import dashboard from './states/dashboard/reducer'
import activityLogs from './states/activityLogs/reducer'
import servicefee from './states/servicefee/reducer'
import payments from './states/payments/reducer'
import expenses from './states/expenses/reducer'
import activities from './states/activities/reducer'

const reducers = combineReducers({
    auth, profile, users, userpositions, weddings, baptisms,
    actOfGivings, activities, dashboard, activityLogs, servicefee, payments, expenses
})

export default reducers