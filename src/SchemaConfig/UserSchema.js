const fs = require('fs');
const Domainconfig = fs.readFileSync(__dirname + '/../JSONConfig/ToolConfig.json');
const ToolConfigDetails = JSON.parse(Domainconfig);
const Errorconfig = fs.readFileSync(__dirname + '/../JSONConfig/ToolErrorConfig.json');
const ErrorMsgs = JSON.parse(Errorconfig);
const cryptoconfig = require('crypto');
const nodemailer = require('nodemailer');
const internetAvailable = require("internet-available");
const handlebars = require('handlebars');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../SchemaConfig/UserDataSchema');

exports.postSignup = (req, res) => {
    const user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email.toLowerCase(),
        UserName: req.body.DisplayName,
        Password: req.body.Password,
        PhoneNumber: req.body.Mobile,
        EmailVerifiedbyUser: false,
        IsActive: false,
        Role: "",
        IsApprovedByAdmin: false
    });
    domaincheck = false;
    var SplitEmail = req.body.Email.substr(req.body.Email.indexOf('@') + 1, req.body.Email.Length);
    var DomainCheckFunction = function () {
        for (i = 0; i < ToolConfigDetails.Mail.Domains.length; i++) {
            if (SplitEmail == ToolConfigDetails.Mail.Domains[i]) {
                domaincheck = true;
                break;
            }
        }
    };
    DomainCheckFunction();
    if (domaincheck == false) {
        var Errordata = [];
        var data = {};
        data.ErrorMsg = ErrorMsgs.Register.HCR004;
        data.ErrorCode = 'HCR004';
        Errordata.push(data);
        res.json(data);
    } else {
        User.findOne({ $or: [{ Email: req.body.Email.toLowerCase() }, { UserName: req.body.DisplayName.toLowerCase() }] }, (err, existingUser) => {
            if (err) {
                var Errordata = [];
                var data = {};
                data.ErrorMsg = err;
                data.ErrorCode = 'HCR001';
                Errordata.push(data);
                res.json(data);
            }

            if (existingUser) {

                if (existingUser.Email === req.body.Email && existingUser.UserName === req.body.DisplayName) {
                    var Errordata = [];
                    var data = {};
                    data.ErrorMsg = ErrorMsgs.Register.HCR001;
                    data.ErrorCode = 'HCR001';
                    Errordata.push(data);
                    res.json(data);

                }
                else if (existingUser.Email === req.body.Email) {
                    var Errordata = [];
                    var data = {};
                    data.ErrorMsg = ErrorMsgs.Register.HCR003;
                    data.ErrorCode = 'HCR003';
                    Errordata.push(data);
                    res.json(data);

                }
                else if (existingUser.UserName === req.body.DisplayName) {
                    var Errordata = [];
                    var data = {};
                    data.ErrorMsg = ErrorMsgs.Register.HCR002;
                    data.ErrorCode = 'HCR002';
                    Errordata.push(data);
                    res.json(data);

                }
            } else {
                //generate unique token
                function randStr(len) {
                    let s = '';
                    while (s.length < len)
                        s += Math.random().toString(36).substr(2, len - s.length);
                    return s;
                }
                // usage
                var getToken = randStr(15);
                user.EmailConfirmationToken = getToken;
                //hash password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.Password, salt, null, function (err, hash) {
                        user.Password = hash;//re assign password value.
                    });
                });

                internetAvailable({
                    // Provide maximum execution time for the verification
                    timeout: 5000,
                    // If it tries 5 times and it fails, then it will throw no internet
                    retries: 5
                }).then(() => {

                    user.save(function (err, doc) {
                        // res.send('Successfully inserted!');
                        if (err) {
                            //  console.log("Error Occured");
                            console.error(err);
                            res.json(err);
                        }
                        var readHTMLFile = function (path, callback) {
                            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                                if (err) {
                                    throw err;
                                    callback(err);
                                }
                                else {
                                    callback(null, html);
                                }
                            });
                        };
                        var smtpConfig = {
                            host: process.env.Mail_host,
                            port: process.env.Mail_port,
                            auth: {
                                user: process.env.Mail_user,
                                pass: process.env.Mail_password
                            }
                        };
                        var transporter = nodemailer.createTransport(smtpConfig);
                        readHTMLFile(__dirname + '/../MailContents/registerconfirmationmail.html', function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                FirstName: user.FirstName,
                                LastName: user.LastName,
                                ProjectName: ToolConfigDetails.ProjectName[0].ProjectName, //,
                                URL: `http://${req.headers.host}/EmailConfirmation/${getToken}`

                            };
                            var htmlToSend = template(replacements);
                            var mailOptions = {
                                to: user.Email,
                                from: process.env.Sender_name + ' <' + process.env.From_mail + '>',
                                subject: ToolConfigDetails.EmailSubjects[0].RegisterMail,
                                //'Registration confirmation for Sales Tracker',
                                html: htmlToSend
                            };
                            transporter.sendMail(mailOptions, (err) => {
                                //res.json("Thank you for registering. An Email has been sent to you. Go to registered email inbox to complete the registration process.");
                                if (err) {
                                    var Errordata = [];
                                    var data = {};
                                    data.ErrorMsg = err;
                                    data.ErrorCode = 'HCR005';
                                    Errordata.push(data);
                                    return res.json(data);
                                }
                                var Errordata = [];
                                var data = {};
                                data.ErrorMsg = ErrorMsgs.Register.HCR005;
                                data.ErrorCode = 'HCR005';
                                Errordata.push(data);
                                return res.json(data);

                            });
                        });
                    });
                }).catch(() => {
                    var Errordata = [];
                    var data = {};
                    data.ErrorMsg = "Error occured please try again later";
                    data.ErrorCode = 'HCR005';
                    Errordata.push(data);
                    return res.json(data);

                });


            }

        });



    };



};


exports.loginVerify = (req, res, next) => {
    debugger;

    passport.authenticate('local', function (err, user, info) {
        debugger
        if (err) { return next(err); }
        if (!user) { return res.status(501).json(info); }

        var ErrorOccured = 0;
        if (user) {
            if (!user.EmailVerifiedbyUser) {
                ErrorOccured++;
                var Errordata = [];
                var data = {};
                data.ErrorMsg = ErrorMsgs.Login.HCL001;
                data.ErrorCode = 'HCL001';
                Errordata.push(data);
                return res.json(data);

            }
            else if (!user.IsApprovedByAdmin) {
                ErrorOccured++;
                var Errordata = [];
                var data = {};
                data.ErrorMsg = ErrorMsgs.Login.HCL002;
                data.ErrorCode = 'HCL002';
                Errordata.push(data);
                return res.json(data);

            }

            else if (!user.IsActive) {
                ErrorOccured++;
                var Errordata = [];
                var data = {};
                data.ErrorMsg = ErrorMsgs.Login.HCL004;
                data.ErrorCode = 'HCL004';
                Errordata.push(data);
                return res.json(data);

            }
            else if (!user.Role) {
                ErrorOccured++;
                var Errordata = [];
                var data = {};
                data.ErrorMsg = ErrorMsgs.Login.HCL006;
                data.ErrorCode = 'HCL006';
                Errordata.push(data);
                return res.json(data);
                //  return res.json(ErrorMsgs.Login.HCL003);

            }

            if (ErrorOccured == 0) {
                req.logIn(user, function (err) {
                    if (err) { return next(err); }
                    //  return res.status(200).json({message:'Login Success'});
                    var Errordata = [];
                    var data = {};
                    data.ErrorMsg = "Login Success";
                    Errordata.push(data);
                    return res.json(Errordata);
                    // return res.json('Login Success');
                });
            }
        } 




    })(req, res, next)


};


exports.EmailCfrmpassword = (req, res, next) => {

    User.findOne({ EmailConfirmationToken: req.params.Emailtoken })
        .exec((err, user) => {
            if (err) {
                //return next(err);
                res.send(err)
            }
            if (!user) {
                return res.send("Invalid Token");

                //return res.redirect('/');
            }
            user.EmailConfirmationToken = "ConfirmedByUser - " + Date.now();
            user.EmailVerifiedbyUser = true;
            if (user.IsApprovedByAdmin == undefined || user.IsApprovedByAdmin == "") {
                user.IsApprovedByAdmin = false;
            }
            user.IsActive = false;
            user.save((err) => {
                if (err) {
                    res.send(err)
                }
                res.send("Thanks for your confirmation login Now.")
            });


        });

};



exports.Forgotpwd = (req, res, next) => {
    // var UserMail = req.body.Email;
    debugger
    var UserMail = req.body.Email;
    internetAvailable({
        // Provide maximum execution time for the verification
        timeout: 5000,
        // If it tries 5 times and it fails, then it will throw no internet
        retries: 5
    }).then(() => {
        User.findOne({ Email: UserMail.toLowerCase() }, function (err, user) {
            debugger
            if (err) { return done(err); }
            if (!user) {
                res.json({ ErrorMsg: 'Incorrect Email.' });
            }
            if (user) {
                //generate unique token
                function randStr(len) {
                    let s = '';
                    while (s.length < len)
                        s += Math.random().toString(36).substr(2, len - s.length);
                    return s;
                }
                // usage
                var frgtToken = randStr(5);

                var readHTMLFile = function (path, callback) {
                    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };
                var smtpConfig = {
                    host: process.env.Mail_host,
                    port: process.env.Mail_port,
                    auth: {
                        user: process.env.Mail_user,
                        pass: process.env.Mail_password
                    }
                };
                var transporter = nodemailer.createTransport(smtpConfig);
                readHTMLFile(__dirname + '/../MailContents/forgotMailContent.html', function (err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        frgtpwd: frgtToken
                    };
                    var htmlToSend = template(replacements);
                    var mailOptions = {
                        to: user.Email,
                        from: process.env.Sender_name + ' <' + process.env.From_mail + '>',
                        subject: ToolConfigDetails.EmailSubjects[0].RegisterMail,
                        //'Registration confirmation for Sales Tracker',
                        html: htmlToSend
                    };
                    transporter.sendMail(mailOptions, (err, info) => {
                        //res.json("Thank you for registering. An Email has been sent to you. Go to registered email inbox to complete the registration process.");
                        debugger
                        if (err) {
                            var Errordata = [];
                            var data = {};
                            data.ErrorMsg = err;
                            data.ErrorCode = 'HCR005';
                            Errordata.push(data);
                            return res.json(data);
                        }
                        if (info) {
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(frgtToken, salt, null, function (err, hash) {
                                    user.Password = hash;//re assign password value.
                                });
                            });
                            user.save((err) => {
                                if (err) {
                                    res.send(err)
                                }
                                res.json({ ErrorMsg: "Reset password send to your mail." });
                            });

                        }


                    });
                });
            }

        });
    }).catch(() => {
        var Errordata = [];
        var data = {};
        data.ErrorMsg = "Error occured please try again later";
        data.ErrorCode = 'HCR005';
        Errordata.push(data);
        res.json(data);

    });

};



function ComparePassword(CandidatePassword) {
    //  return await bcrypt.compare(CandidatePassword, this.Password, (err, isMatch) => {
    //         cb(err, isMatch);
    //     });
    //bcrypt.compareSync(CandidatePassword, this.Password);

    return bcrypt.compareSync(CandidatePassword, GlobalUserPwd)
};



// passport.use('local', new LocalStrategy({
//     usernameField: 'Email',
//     passwordField: 'Password'
// },
//     function (Email, Password, done) {
//         debugger
//         User.findOne({ Email: Email.toLowerCase() }, function (err, user) {
//             debugger
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, {
//                     ErrorMsg: 'Incorrect Email.'
//                 });
//             }
//             if (user) {
//                 GlobalUserPwd = user.Password;
//             }
//             if (!ComparePassword(Password)) {
//                 return done(null, false, {
//                     ErrorMsg: 'Incorrect password.'
//                 });
//             }
//             return done(null, user);
//         });
//     }
// ));


// passport.serializeUser(function (user, done) {
//     done(null, user._id);
// });

// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

