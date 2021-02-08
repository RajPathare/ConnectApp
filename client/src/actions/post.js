
import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types';

// Get posts

export const getPosts = () => {
    return async (dispatch) => {

        try {
            const res = await axios.get('/api/posts');

            dispatch({ type: GET_POSTS, payload: res.data });
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}


// Add a like

export const addLike = (postId) => {
    return async (dispatch) => {

        try {
            const res = await axios.put(`/api/posts/like/${postId}`);

            dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}

// Unlike a post

export const removeLike = (postId) => {
    return async (dispatch) => {

        try {
            const res = await axios.put(`/api/posts/unlike/${postId}`);

            dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data } });
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}


// Delete post

export const deletePost = (postId) => {
    return async (dispatch) => {

        try {
            const res = await axios.delete(`/api/posts/${postId}`);

            dispatch({ type: DELETE_POST, payload: postId });
            dispatch(setAlert('Post removed!', 'success'));
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}

// Add a post

export const addPost = (formData) => {
    return async (dispatch) => {

        try {

            const config = {
                'Content-type': 'application/json'
            }



            const res = await axios.post('/api/posts', formData, config);

            dispatch({ type: ADD_POST, payload: res.data });
            dispatch(setAlert('Post created!', 'success'));
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}

// Get a post

export const getPost = (postId) => {
    return async (dispatch) => {

        try {
            const res = await axios.get(`/api/posts/${postId}`);

            dispatch({ type: GET_POST, payload: res.data });
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}

// add a comment

export const addComment = (postId, formData) => {
    return async (dispatch) => {

        try {

            const config = {
                'Content-type': 'application/json'
            }

            const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

            dispatch({ type: ADD_COMMENT, payload: res.data });
            dispatch(setAlert('Comment added!', 'success'));
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}

// Delete a comment

export const deleteComment = (postId, commendId) => {
    return async (dispatch) => {

        try {

            const res = await axios.delete(`/api/posts/comment/${postId}/${commendId}`);

            dispatch({ type: REMOVE_COMMENT, payload: commendId });
            dispatch(setAlert('Comment removed!', 'success'));
        }
        catch (err) {
            dispatch({ type: POST_ERROR, payload: { msg: err.response.statusText, status: err.response.status } })
        }
    }

}