const mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
const userSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true, trim: true, lowercase: true },
    UserName: { type: String, unique: true, trim: true, lowercase: true },
    Password: String,
    PhoneNumber: String,
    EmailVerifiedbyUser: Boolean,
    Role: String,
    IsApprovedByAdmin: Boolean,
    IsActive: Boolean,
    EmailConfirmationToken: String,
    CreatedOn: { type: Date, default: Date.now },
    UpdatedOn: { type: Date, default: Date.now }
},
    { versionKey: false });


let User = mongoose.model("user", userSchema);
module.exports = User;
