const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator/check');
const request = require('request');

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

// route - DELETE api/profile
// delete profile,user and posts
// access value - private

router.delete('/',auth, async (req,res)=> {
    try {

        //remove users post
        await Post.deleteMany({ user: req.user.id });

        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User removed!'});
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
});


// route - PUT api/profile/experience (this can also be made a POST req), we use PUT since we are updating part of a profile
// Add profile experience
// access value - private

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {

        title,
        company,
        location,
        from,
        to,
        current,
        description

    } = req.body

    const newExp = {

        title: title,
        company: company,
        location: location,
        from: from,
        to: to,
        current: current,
        description: description

    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // experience is an array (check Profile model). You can also use .push() here but unshift always adds the value first and push adds it last
        // this is done because we need to add recent experience in the top.
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }

});

// route - DELETE api/profile/experience/:exp_id
// delete a experience from profile
// access value - private

router.delete('/experience/:exp_id',auth, async (req,res)=>{

    try {

        const profile = await Profile.findOne({ user: req.user.id });

        // we will map through the experience array and find the experience id that we need to remove
        const removeIndex = profile.experience.map((item)=> item.id).indexOf(req.params.exp_id);

        // splice removes the item from the array (1 -> number of items to be removed)
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
})


// route - PUT api/profile/education (this can also be made a POST req), we use PUT since we are updating part of a profile
// Add profile education
// access value - private

router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {

        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description

    } = req.body

    const newEdu = {

        school: school,
        degree: degree,
        fieldofstudy: fieldofstudy,
        from: from,
        to: to,
        current: current,
        description: description

    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // education is an array (check Profile model). You can also use .push() here but unshift always adds the value first and push adds it last
        // this is done because we need to add recent education in the top.
        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }

});

// route - DELETE api/profile/education/:edu_id
// delete a education from profile
// access value - private

router.delete('/education/:edu_id',auth, async (req,res)=>{

    try {

        const profile = await Profile.findOne({ user: req.user.id });

        // we will map through the education array and find the education id that we need to remove
        const removeIndex = profile.education.map((item)=> item.id).indexOf(req.params.edu_id);

        // splice removes the item from the array (1 -> number of items to be removed)
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
});


// route - GET api/profile/github/:username
// get user repos from github
// access value - public

router.get('/github/:username', async (req,res)=>{
    try {

        const clientId = process.env.githubClientId;
        const clientSecret = process.env.githubSecret;

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${clientId}&client_secret=${clientSecret}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };

        request(options, (err,response,body) =>{
            if(err) {
                console.log(err);
            }

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found'});
            }

            res.json(JSON.parse(body));

        })

    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('Server error!');
    }
})



module.exports = router;