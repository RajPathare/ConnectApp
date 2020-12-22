const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// route - POST api/posts
// Create a post
// access value - private

router.post('/',[auth, [
    check('text','Text is required').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const user = await User.findById(req.user.id).select('-password');

        // after fetching the logged in user details, we make a new object.
        // text is the only field that the user will submit through the UI so we are requiring only that.
        // All other fields come from the user object that we fetch above
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        const post = new Post(newPost)

        await post.save();

        res.json(post);
    }

    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');

    }
});

// route - GET api/posts
// Get all posts
// access value - private

router.get('/',auth, async (req,res)=>{
    try {

        const posts = await Post.find({}).sort({ date: -1 });

        res.json(posts);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }
});

// route - GET api/posts/:id
// Get post by id
// access value - private

router.get('/:post_id', auth, async (req,res)=> {

    try {

        const post = await Post.findById(req.params.post_id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }

        res.json(post);
    }
    catch (e) {

        console.log(e.message);

        if(e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }

        res.status(500).send('Server error');
    }

})


// route - DELETE api/posts/:id
// Delete post by id
// access value - private

router.delete('/:post_id', auth, async (req,res)=> {

    try {

        const post = await Post.findById(req.params.post_id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // check if the user owns the post

        // post.user = ObjectId so convert it to string
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({ msg: 'Post removed'});
    }
    catch (e) {
        console.log(e.message);

        if(e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found '});
        }

        res.status(500).send('Server error');
    }
});


// route - PUT api/posts/like/:id (put since we are updating our post)
// Like a post
// access value - private

router.put('/like/:id', auth, async (req,res)=> {
    try {

        const post = await Post.findById(req.params.id);

        // check if post has been liked by the user (a user should only be able to like the post once)

        // filter through all users who have liked the post and check if length > 0
        if(post.likes.filter((like)=> like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }

        // post.likes.unshift is same as push but it adds the value in the beginning
        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }
});


// route - PUT api/posts/unlike/:id (put since we are updating our post)
// Unlike a post
// access value - private

router.put('/unlike/:id', auth, async (req,res)=> {
    try {

        const post = await Post.findById(req.params.id);

        // check if post has been liked by the user (a user should only be able to like the post once)

        // filter through all users who have liked the post and check if length === 0
        if(post.likes.filter((like)=> like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet liked' })
        }

        // get remove index
        const removeIndex = post.likes.map((like)=> like.user.toString()).indexOf(req.user.id);

        // remove the index from the likes array! 1 -> rem one item
        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }
});


// route - POST api/posts/comment/:id
// Comment on a post
// access value - private

router.post('/comment/:id',[auth, [
    check('text','Text is required').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    }

    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');

    }
});


// route - DELETE api/posts/comment/:post_id/:comment_id
// Delete comment
// access value - private

router.delete('/comment/:post_id/:comment_id', auth, async (req,res)=> {
    try {

        const post = await Post.findById(req.params.post_id);

        // get comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if(!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // check if the user who made the comment is deleting the comment

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // get index of the comment which is to be removed

        const removeIndex = post.comments.map((comment) => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }
})





module.exports = router;