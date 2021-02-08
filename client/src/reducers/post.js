
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from '../actions/types';

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}

export default (state = initialState, action) => {
    switch(action.type){
        case GET_POSTS:
            return {...state, posts: action.payload, loading: false};
        case POST_ERROR:
            return {...state, error: action.payload, loading: false};
        case UPDATE_LIKES: // map through all posts and find the post which we need to update. After we get the post, just update the likes array inside of it.
            return {...state, posts: state.posts.map((post) => post._id === action.payload.postId ? {...post, likes: action.payload.likes} : post), loading: false }
        default:
            return state;
    }
}

