
//const User = require('../SchemaConfig/UserSchema');
const User = require('../SchemaConfig/UserDataSchema');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

passport.use('local', new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Password'
},
    function (Email, Password, done) {
        debugger
        User.findOne({ Email: Email.toLowerCase() }, function (err, user) {
            debugger
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {

                    ErrorMsg: 'Incorrect Email.'

                });
            }
            if (user) {
                GlobalUserPwd = user.Password;
            }
            if (!ComparePassword(Password)) {
                return done(null, false, {

                    ErrorMsg: 'Incorrect password.'

                });
            }
            return done(null, user);
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
//console.log('id', id); 
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

 

function ComparePassword(CandidatePassword) {
    //  return await bcrypt.compare(CandidatePassword, this.Password, (err, isMatch) => {
    //         cb(err, isMatch);
    //     });
    //bcrypt.compareSync(CandidatePassword, this.Password);
    return bcrypt.compareSync(CandidatePassword, GlobalUserPwd)
};
