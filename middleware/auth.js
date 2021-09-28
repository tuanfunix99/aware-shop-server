

//Dependencies
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //check token exist
        if(!token) {
            throw new Error('Cookie expires')
        }
        //verify token
        const { _id } = await jwt.verify(token, process.env.PRIVATE_JWT);
        const user = await User.findById(_id);
        //check user exist
        if(!user) {
            throw new Error('User not exist')
        }
        //check user has verify email
        if(!user.isVerify){
            throw new Error('Your account is not verify. Please check your email');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send(error.message);
    }
}