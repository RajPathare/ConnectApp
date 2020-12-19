const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // get token from the header
    const token = req.header('x-auth-token');

    // check if no token
    if(!token) {
        return res.status(401).json({ msg: 'No token, auth denied!'})
    }

    // verify token
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        // console.log(decoded);

        req.user = decoded.user; // we passed payload like -> payload = { user: { id: user.id }} 
        // console.log(req);
        next();
    }
    catch (e) {
        res.status(401).json({ msg: 'Token is not valid '});
    }
    
}
