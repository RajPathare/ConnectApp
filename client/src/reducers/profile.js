
import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from '../actions/types';

const initialState = {
    profile: null, // current profile for the user + any profile the user vists
    profiles: [], // we will be listing profiles for all users, this will go here
    repos: [], // git repos
    loading: true,
    error: {} // errors are added here
}

export default (state = initialState, action) => {
    switch(action.type){
        case GET_PROFILE:
            return {...state, profile: action.payload, loading: false};
        case PROFILE_ERROR:
            return {...state, profile: null, error: action.payload, loading: false};
        case CLEAR_PROFILE: 
            return {...state, profile: null, repos: [], loading: false};
        case UPDATE_PROFILE:
            return {...state, profile: action.payload, loading: false};
        case GET_PROFILES:
            return {...state, profiles: action.payload, loading: false};
        case GET_REPOS:
            return {...state, repos: action.payload, loading: false};
        default:
            return state;
    }
}