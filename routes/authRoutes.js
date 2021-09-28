

//Dependencies
const express = require('express');
const authControllers = require('../controllers/authControllers')
const { authenticate } = require('../middleware/auth');

//Instantiate router
const router = express.Router();


//router register user
router.post('/register', authControllers.register)

//router login
router.post('/login', authControllers.login)

//router logout
router.get('/logout', authenticate, authControllers.logout)

//router ver
router.get('/verify/:token/:_id', authControllers.verifyAccount);

//export the module
module.exports = router;