const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,  
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    }
    
},{
    timestamps:true
});

module.exports = mongoose.model("User", UserSchema);