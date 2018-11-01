var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var Schema = new Schema({
    RoleName: { type: String, unique: true, trim: true, uppercase: true },
    Description: String,
    IsActive: Boolean,
    UIList: [{
        UiName: String,
        View: Boolean,
        Edit: Boolean
    }],
    CreatedById: String,
    CreatedOn: { type: Date, default: Date.now },
    UpdatedById: String,
    UpdatedOn: { type: Date, default: Date.now }
},
    { versionKey: false });

let Role = mongoose.model("Role", Schema);


exports.AddNewRole = (req, res) => {
    role = new Role(
        {
            RoleName: req.body.Role,
            Description: req.body.Description,
            IsActive: req.body.IsActive,
            CreatedById: req.user.UserName,
            UIList: [{
                "UiName": "Manage Roles",
                "View": false,
                "Edit": false
            }]
        });
    role.save(function (err, doc) {
        if (err) {
            //  console.log("Error Occured");
            console.error(err);
            res.json(err);
        }
        res.json(doc);
        // console.log(req.user.UserName)
        // res.send('Successfully inserted!');

    });
};


exports.ShowRole = (req, res) => {
    Role.find({}).sort({ '_id': -1 }).exec(function (err, docs) {
        if (err) {
            // console.log("Error Occured");
            console.log(err);
        }
        res.json(docs);
    });
};


exports.FindRole = (req, res, next) => {
    Role.find({ RoleName: req.body.Role.toUpperCase() }).exec(function (err, docs) {
        if (err) {
            // console.log("Error Occured");
            console.log(err);
        } else {
            if (docs.length > 0) {
                return res.json("Name Already Exists");
            } else {
                next();
            }
        }
    });
};

exports.UpdateRole = (req, res, next) => {

    if(req.body.length>0){
        for(i=0;i<req.body.length;i++){
            var id = req.body[i]._id;
            var RoleName = req.body[i].RoleName;
            var Description = req.body[i].Description;
            var IsActive = req.body[i].IsActive;
          
            Role.update({ _id: id }, {
                $set: {
                    RoleName: RoleName,
                    Description: Description,
                    IsActive: IsActive,
                    UpdatedById: req.user.UserName
                }
            },
            function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                   
                }
            );

        }
        res.json("Updated Successfully");
    }
   
};