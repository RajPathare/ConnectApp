
import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import auth from './auth';
import profile from './profile';

export default combineReducers({
    alert: alertReducer,
    auth: auth,
    profile: profile
});