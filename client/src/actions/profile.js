
import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, ACCOUNT_DELETED  } from './types';

// Get current users profile
export const getCurrentProfile = () => {
    return async (dispatch) => {

        try {
            const res = await axios.get('/api/profile/me');

            dispatch({ type: GET_PROFILE, payload: res.data });
        }
        catch (err) {
            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}

// Create or update a profile

export const createProfile = (formData, history, edit = false) => {

    return async (dispatch) => {

        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await axios.post('/api/profile', formData, config);

            dispatch({ type: GET_PROFILE, payload: res.data });
            dispatch(setAlert(edit ? 'Profile Updated!': 'Profile created!', 'success'));

            if(!edit) {
                history.push('/dashboard');
            }
            
        } catch (err) {

            const errors = err.response.data.errors;

            // you can call actions from anywhere. Here we are calling setAlert action from the profile action.
            if(errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));
                })
            }

            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }

    }

}

// Add experience

export const addExperience = (formData, history) => {

    return async (dispatch) => {

        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await axios.put('/api/profile/experience', formData, config);

            dispatch({ type: UPDATE_PROFILE, payload: res.data });
            dispatch(setAlert('Experience added', 'success'));

            history.push('/dashboard');
            
        } catch (err) {

            const errors = err.response.data.errors;

            // you can call actions from anywhere. Here we are calling setAlert action from the profile action.
            if(errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));
                })
            }

            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }

    }

}


// Add education

export const addEducation = (formData, history) => {

    return async (dispatch) => {

        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await axios.put('/api/profile/education', formData, config);

            dispatch({ type: UPDATE_PROFILE, payload: res.data });
            dispatch(setAlert('Education added', 'success'));

            history.push('/dashboard');
            
        } catch (err) {

            const errors = err.response.data.errors;

            // you can call actions from anywhere. Here we are calling setAlert action from the profile action.
            if(errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));
                })
            }

            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }

    }

}

// Delete experience

export const deleteExperience = (id) => {

    return async (dispatch) => {

        try {

            const res = await axios.delete(`/api/profile/experience/${id}`);

            dispatch({ type: UPDATE_PROFILE, payload: res.data });
            dispatch(setAlert('Experience deleted', 'success'));
            
        } catch (err) {

            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }

    }

}

// Delete education

export const deleteEducation = (id) => {

    return async (dispatch) => {

        try {

            const res = await axios.delete(`/api/profile/education/${id}`);

            dispatch({ type: UPDATE_PROFILE, payload: res.data });
            dispatch(setAlert('Education deleted', 'success'));
            
        } catch (err) {

            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }

    }

}

// Delete account and profile

export const deleteAccount = (id) => {
    return async (dispatch) => {


        if(window.confirm('Are you sure you want to delete your account?')) {

            try {

                const res = await axios.delete(`/api/profile`);
    
                dispatch({ type: CLEAR_PROFILE });
                dispatch({ type: ACCOUNT_DELETED });
                dispatch(setAlert('Account was deleted successfully'));
                
            } catch (err) {
    
                dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
            }

        }

    }

}