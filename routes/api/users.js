const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// route - POST api/users
// Register user
// access value - public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters!').isLength({ min: 6 })
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { name, email, password } = req.body;


    try {

        // see if the user exists
        let user = await User.findOne({ email });

        if(user) {
            // we put errors here to match with the errors obj that we get above (not necessary)
            return res.status(400).json({ errors: [ { msg: 'The user already exists' } ] })
        }

        // get users gravatar (if exists) or set a default gravatar
        const avatar = gravatar.url(email, {
            s: '200', // size of image
            r: 'pg', // pg -> images should not contain any explicit content
            d: 'mm' // default image if the user does not have a gravatar account
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // encrpyt pass
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // console.log(user); // we will have _id here too

        // return jwt
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