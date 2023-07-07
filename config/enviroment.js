const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval : '1d',
    path : logDirectory
});



const production = {
    name : 'production',
    asset_path : process.env.CODIAL_asset_path,
    session_cookie_key : 'blahsomething',
    db : process.env.CODIAL_dataBaseProduction,
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth: {
            user : process.env.CODIAL_userEmail,
            pass : 'swwvokjzjqqmvcnn'
        }
    },
    goggle_clientID : "651120776925-jalgkplaar7p3a1chn79b4jlod21reke.apps.googleusercontent.com",
    google_clientSecret : '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',
    google_callbackURL : process.env.CODIAL_callBackFunction,
    jwt_screate : process.env.CODIAL_jwt_screate,
    morgan : {
        mode : 'combined',
        options : {
            stream : accessLogStream
        }
    }
}

const development = {
    name : 'Development',
    asset_path : './assets',
    session_cookie_key : 'blahsomething',
    db : 'codeial_development',
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth: {
            user : 'codeial2714@gmail.com',
            pass : 'swwvokjzjqqmvcnn'
        }
    },
    goggle_clientID : "651120776925-jalgkplaar7p3a1chn79b4jlod21reke.apps.googleusercontent.com",
    google_clientSecret : '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',
    google_callbackURL : 'http://localhost:8000/users/auth/google/callback',
    jwt_screate : 'codeial',
    morgan : {
        mode : 'dev',
        options : {
            stream : accessLogStream
        }
    }
}

// module.exports = eval(((process.env.CODIAL_ENVIROMENT) == undefined) ? development : process.env.CODIAL_ENVIROMENT);
// module.exports = development;
// console.log(process.env.CODIAL_ENVIROMENT + " **********");   
module.exports = eval(process.env.CODIAL_ENVIROMENT) == undefined ? development : eval(process.env.CODIAL_ENVIROMENT);