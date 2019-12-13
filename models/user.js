const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    image: {
        type: String,
        default: "/imgs/defaultprofile.png"
    },
    location: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);