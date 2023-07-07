const express = require('express');
const env = require('./config/enviroment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal  = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport_oauth2-strategy');
//const mongoStore = require('connect-mongo'); // if you get error check here
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
//make uploads part available to the broweser
app.use('/uploads', express.static(__dirname + '/uploads'));

// Set up the chat server
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

app.use(express.urlencoded()); 

app.use(cookieParser());

app.use(express.static(env.asset_path)); 

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl:'mongodb://127.0.0.1/codeial_development',
            autoRemover : 'disabled'
        },
        function(err){
            console.log("Error in the mongo-store");
        }
    ),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.use(logger(env.morgan.mode , env.morgan.options));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});