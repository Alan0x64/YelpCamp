const express = require('express');
const passport = require('passport');
const router=express.Router();
const catch_async = require('../utils/catch_async');
const users=require('../controllers/users');

//Sign Up Route
router.route('/register')
    .get(users.signupForm)
    .post(catch_async(users.signup))



//Log In Route
router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catch_async(users.login))


//Logout Route
router.get('/logout',users.logout)



module.exports=router;