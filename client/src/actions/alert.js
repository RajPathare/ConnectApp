
import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 3000) => {
    return async (dispatch) => {
        const id = uuid(); // generate a random id
        dispatch({ type: SET_ALERT, payload: {msg, alertType, id} });

        // remove the alert after 3s!
        setTimeout(()=> {
            dispatch({ type: REMOVE_ALERT, payload: id});
        }, timeout);
    }

}

