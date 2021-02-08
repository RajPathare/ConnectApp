
import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from './types';

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