const express = require('express');
const router = express.Router();

// route - GET api/profile
// test route
// access value - public

router.get('/', (req,res) => {
    res.json({
        "message": "Profile route!"
    })
})


module.exports = router;