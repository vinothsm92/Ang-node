const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const logger = require('morgan');
var cookieParser = require('cookie-parser');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const expressValidator = require('express-validator');
const http = require('http');
const app = express();
// cros origin handling method start
const cors = require('cors');



dotenv.load({ path: '.env.Config' });
app.use(bodyParser.json());

// app.use(express.static(__dirname + "/src"));
// app.set('views', __dirname + '\\src');




app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//mongodb config
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});
app.use(cookieParser(process.env.SESSION_SECRET));

// //express session config
// app.use(session({
//     name: 'UpgradeApp.sid',
//     resave: true,
//     secret: process.env.SESSION_SECRET,
//     store: new MongoStore({
//         url: process.env.MONGODB_URI,
//         autoReconnect: true
//     }),
//     saveUninitialized: false,
//     cookie: {//New
//         maxAge: 36000000,
//         httpOnly: false,
//         secure: true
//     }

// }));

app.use(session({
    name:'myname.sid',
    resave:false,
    saveUninitialized:false,
    secret:'secret',
    cookie:{
      maxAge:36000000,
      httpOnly:false,
      secure:false
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));

//cors origin config
app.use(cors({
    origin: ['http://localhost:4200','http://localhost:8085', 'http://127.0.0.1:4200', 'http://192.168.1.93:4200',],
    credentials: true
}));
//bodyparser config
//View Engine
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
//app.use(express.static(path.join(__dirname, 'src')));

app.use(bodyParser.urlencoded({ limit: "200mb", extended: true, parameterLimit: 200000 }));
 require('./src/SchemaConfig/PassportConfig');
app.use(passport.initialize());
app.use(passport.session());


//schema config

const UserConfig = require('./src/SchemaConfig/UserSchema');
const RoleConfig = require('./src/SchemaConfig/RoleSchema');


function isLoggedIn(req, res, next) {
    var ss = req.isAuthenticated();
    if (req.isAuthenticated()) next();
    else return res.json('Un-Authenticated');

};
app.get('/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.json("logout");
});
app.get('/GetUser', isLoggedIn, function (req, res, next) {
    return res.json(req.user.UserName);
});


app.post('/signup', UserConfig.postSignup);
app.post('/login', UserConfig.loginVerify);
app.get('/EmailConfirmation/:Emailtoken', UserConfig.EmailCfrmpassword);
app.post('/Forgotpwd', UserConfig.Forgotpwd);

app.post('/RoleInfo',isLoggedIn,RoleConfig.FindRole,RoleConfig.AddNewRole)
app.get('/GetRoleInfo',isLoggedIn,RoleConfig.ShowRole)
app.put('/UpdateRoleInfo',isLoggedIn,RoleConfig.UpdateRole)









app.use(express.static(path.join(__dirname,'dist/MDProject')));

app.use('*',(req,res)=>{
	
	res.sendFile(path.join(__dirname,'dist/MDProject/index.html'))
});



app.set('port', process.env.App_PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('%s server running on port', chalk.green('✓'), app.get('port'));
    console.log('  Press CTRL-C to stop\n');
});
