const user =require("../model/useraccount");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {JWT} = require("../JWT/jwt")
const ConnectedConversation = require("../model/ConnectedConversation")
exports.userSignup =async (req,res)=>{
    try {
        const {username,email,password } =req.body ;
        let autenticate = await  user.findOne({username});
        if(autenticate ===null){
            autenticate = await user.findOne({email});
            if(autenticate ===null){
                const userDate = user({
                    username,
                    email,
                    password
                })
                await userDate.save();
                res.status(201).json({message: "Login Successfully ",accesstoken : userDate.refreshtoken , refreshtoken:userDate.accesstoken })
            }
            else{
                res.status(202).json({message : "Email already exist"})
            }
        }
        else{
            res.status(203).json({message : "Username already exist"})
        }
    } catch (error) {
        console.log(error)
        res.status(204).json({message : "Username already exist"})
    }
}

exports.userSignin = async (req,res)=>{
    try {
            const {email,password} = req.body;
            let authenticate = await  user.findOne({email});
            if(authenticate){
                let id  = authenticate.id;
                authenticate = await bcrypt.compare(password,authenticate.password);
              if(authenticate === true){
                const {accesstoken,refreshtoken}= JWT(id);
                authenticate =  await user.findByIdAndUpdate({_id:id} ,{$set :{accesstoken,refreshtoken}});
                res.status(200).json({message : 'Login sucessfully' ,accesstoken,refreshtoken});
              }
              else{
                res.status(201).json({message : "Invalid Username or password "});
              }
            }
            else{
                res.status(202).json({message: "Invalid Username or password "});
            }
    } catch (error) {
        console.log(error)
    }
}

exports.detailuser =async(req,res)=>{
    try {
        const {accesstoken} = req.body ;
        const verifiedtoken = jwt.verify(accesstoken, process.env.Secretkey);
        response = await user.findById(verifiedtoken.id).select('-password');
        if(response){   
            res.status(200).json({id:response._id.toString(),username :response.username,email:response.email})
        }
        else{
            res.status(201).json({message:"User not Authenticated and redirect to signup page"})
        }
    } catch  (error) {
        console.log(error)
    }
}


exports.allavailableuserforfriendrequest = async(req ,res) =>{
    try {
        const {email} = req.params;
        let response =  await user.find().select("username").select("email");
        let filterusername = response.filter((item)=>  email !==item.email);
            if(response && response.length !==0){
                res.status(200).json({filterusername})
            }
            else{
                res.status(401).json({message :"No Friend Found"});
            }
    } catch (error) {
        console.log(error)
    }
}

exports.friendlist = async(req,res) =>{  

    const {userid} =req.params
    console.log(userid)

    let userId = userid.toString();
    try {
        let response = await  ConnectedConversation.find({members:userId})
          response.map((items)=>{
            console.log(items.id);
            items.members = items.members.filter((item)=> item !== userId)
        })
        console.log(response);

        const Friendlist  = await Promise.all(  response.map(async (items)=>{
            conversationId = items.id;
            conversationMembersID = items.members[0] ;
            FriendName = await user.findById(conversationMembersID).select("username");
            return {
                conversationId,
                conversationMembersID,
                FriendName:FriendName.username
            }
        }))
        console.log(Friendlist)
    } catch (error) {
        console.log(error)
    }
}