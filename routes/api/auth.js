const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// route - GET api/auth
// test route
// access value - private

router.get('/', auth, async (req,res) => {

    try {
        // req.user.id -> we get this from middleware
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            user
        })

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }

});

// route - POST api/auth
// Authenticate the user and get token
// access value - public

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password } = req.body;


    try {

        // see if the user exists
        let user = await User.findOne({ email });

        // if there is no user -> Invalid credentials
        if(!user) {
            // we put errors here to match with the errors obj that we get above (not necessary)
            return res.status(400).json({ errors: [ { msg: 'Invalid credentials!' } ] })
        }

        // if email exists, we need to check if the password is correct

        // compare plain pass with hashed pass
        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched) {
            return res.status(400).json({ errors: [ { msg: 'Invalid credentials!' } ] })
        }

        const payload = {
            user: {
                id: user.id // in mongoose ._id == .id 
            }
        }

        jwt.sign(payload, process.env.jwtSecret, {
            expiresIn: 360000
        },(err,token) => {
            if(err) throw err;
            res.json({ token });
        });

    }

    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!')
    }
})


module.exports = router;