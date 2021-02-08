import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';
import PropTypes from 'prop-types';

const CommentForm = ({ addComment, postId }) => {

    const [text, setText] = useState('');


    const onSubmit = (e) => {
        e.preventDefault();
        addComment(postId, {text});
        setText('');
    }

    return (
        <div class="post-form">
        <div class="bg-primary p">
          <h3>Add a comment!</h3>
        </div>
        <form class="form my-1" onSubmit={(e) => onSubmit(e)}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            value = {text}
            onChange = {(e) => setText(e.target.value)}
            required
          ></textarea>
          <input type="submit" class="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
    )
}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired
}


export default connect(null, { addComment })(CommentForm)
