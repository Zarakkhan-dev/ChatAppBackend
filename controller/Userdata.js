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

exports.friendlist = async (req, res) => {  
    const { userid } = req.params;
    const userId = userid.toString();

    try {
        // Fetch conversations where the user is a member
        let response = await ConnectedConversation.find({ members: userId });
        
        // Filter out the userId from each conversation's members
        response = response.map((items) => {
            items.members = items.members.filter((item) => item !== userId);
            return items;
        });

        // If no conversations are found, return 404
        if (response.length === 0) {
            return res.status(404).json({ message: "No friend found" });
        }

        // Create a friend list by fetching member details
        const friendList = await Promise.all(
            response.map(async (items) => {
                const conversationId = items.id;
                const conversationMembersID = items.members[0]; // Assuming the other member is at index 0

                // Fetch the friend's username
                const friend = await user.findById(conversationMembersID).select("username");

                // If the friend doesn't exist, return null
                if (!friend) {
                    return null;
                }

                return {
                    conversationId,
                    conversationMembersID,
                    friendName: friend.username
                };
            })
        );

        // Filter out any null entries in the friend list (in case any user lookups failed)
        const filteredFriendList = friendList.filter(item => item !== null);
        console.log(filteredFriendList)
        // Return the final friend list
        res.status(200).json(filteredFriendList);

    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};
