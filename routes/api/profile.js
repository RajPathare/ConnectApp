const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

// route - GET api/profile/me (get just 1 profile)
// Get current users profile
// access value - private

router.get('/me', auth, async (req,res) => {
    try {                                                                       
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',['name','avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

        res.status(200).json(profile);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
});

// route - POST api/profile
// create/update a user profile
// access value - private

router.post('/', [auth, [ 
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
 ]], async (req,res)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const {

        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin

    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        // skills - a,b,c -> string -> array -> map through array and trim spaces if added.
       profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object (we make another obj since we can't reference profileFields.social.youtube (deep nesting))
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            // if users profile already exists, update it with the passed fields
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile);
        }

        // if there is no profile for the user, create a new one
        profile = new Profile(profileFields);
        await profile.save();

        res.json(profile);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
});

// route - GET api/profile
// Get all profiles
// access value - public

router.get('/', async (req,res)=> {
    try {
        const profiles = await Profile.find({}).populate('user', ['name','avatar']);
        res.json(profiles);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
})


// route - GET api/profile/user/:user_id
// Get profile by userId
// access value - public

router.get('/user/:user_id', async (req,res)=> {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name','avatar']);
        
        if(!profile) {
            return res.status(400).json({ msg: 'Profile not found!'});
        }

        res.json(profile);
    }
    catch (e) {
        console.log(e.message);

        // if someone enters a random userId which is not an ObjectId
        if(e.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found!'});
        }
        res.status(500).send('Server error!');
    }
})


module.exports = router;