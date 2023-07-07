const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

// router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.get('/profile/:id', passport.checkAuthentication , usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);

// Forget password.
router.get('/forget-password' , usersController.forgetPasswordPage);
router.post('/forget-password-page' , usersController.forgetPasswordLink);

router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
router.get('/auth/google/callback' , passport.authenticate('google', {failureRedirect: '/users/sign-in'}) , usersController.createSession);

module.exports = router;