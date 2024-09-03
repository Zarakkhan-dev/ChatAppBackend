const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const UserSchema = new  mongoose.Schema ({
    username : {
        type:String,
        trim:true,
        require:[true,"Username is required"],
        unique:true
    },
    email:{
        type:String,
        trim:true,
        require:[true,"Email is required"]
    },
    password:{
        type:String,
        require:[true,"Password is required"],
    },
    accesstoken:{
        type:String
    },
    refreshtoken:{
        type:String
    }
})

UserSchema.pre("save",async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password ,10);

    }
    if(!user.accesstoken && !user.refreshtoken){
        user.accesstoken = jwt.sign({id:user._id,email:user.email} ,process.env.Secretkey , {expiresIn : "1d"} );
        user.refreshtoken = jwt.sign({id:user._id,email:user.email} ,process.env.Secretkey,{expiresIn:"7h"} );
    }

    next();
});


module.exports = mongoose.model ("Usercredentials",UserSchema);