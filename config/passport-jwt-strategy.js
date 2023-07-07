const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const env = require('../config/enviroment');

// let opts = {
//     jwtFromRequtest : ExtractJWT.fromAuthHeaderAsBearerToken,
//     secretOrKey : 'codeial'
// }

let opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = env.jwt_screate;

passport.use(new JWTStrategy(opts, async function(jwtPayLoad, done){
    let user = await User.findById(jwtPayLoad._id);
    if(user){
        return done(null, user);
    }else{
        return done(null, false);
    }

}))



module.export = passport;