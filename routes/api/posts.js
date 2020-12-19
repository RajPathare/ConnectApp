const express = require('express');
const router = express.Router();

// route - GET api/posts
// test route
// access value - public

router.get('/', (req,res) => {
    res.json({
        "message": "Posts route!"
    })
})


module.exports = router;