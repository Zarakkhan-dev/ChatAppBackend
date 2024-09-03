const jwt = require("jsonwebtoken");

exports.JWT = (id)=>{
    accesstoken = jwt.sign({id} ,process.env.Secretkey );
    refreshtoken = jwt.sign({id} ,process.env.Secretkey );
    return {accesstoken, refreshtoken}
}

