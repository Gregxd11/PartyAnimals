const mongoose = require("mongoose");

// SCHEMA SETUP
const animalSchema = new mongoose.Schema({
    name: String,
    postType: String,
    price: String,
    image: {
        type: String, 
        default: "/imgs/defaultpost.png"
        },
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        image: String,
        location: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Animal", animalSchema)