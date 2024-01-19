const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    likedPosts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
    photo : {
        type : String
    },
    resetToken : String,
    expireToken : Date
})

module.exports = mongoose.model('User' , UserSchema)