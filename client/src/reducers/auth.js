import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthencticated: null,
    loading: true,
    user: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {...state, ...action.payload, isAuthencticated: true, loading: false};
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {...state, token: null, isAuthencticated: false, loading: false};
        default:
            return state;
    }
}

