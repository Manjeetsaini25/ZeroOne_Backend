const express = require('express');

const authRouter =  express.Router();
const {register, login,logout} = require('../controllers/userAuthent')


// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',logout);
// authRouter.get('/getProfile',getProfile);

module.exports = authRouter;

