const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('../config/enviroment');


passport.use(new googleStrategy({
        clientID : env.goggle_clientID,
        clientSecret : env.google_clientSecret,
        callbackURL : env.google_callbackURL
    },

    async function(userToken, refreshToken, profile, done){
        let user = await User.findOne({email : profile.emails[0].value});
        try{
            if(user){
                done(null, user);
            }else{
                let u = await User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                })
                done(null, u);
            }

        }catch(err){
            console.log("Error in the passport-outh2-strategr "+ err);
            return ;
        }
    }
))

module.exports = passport;