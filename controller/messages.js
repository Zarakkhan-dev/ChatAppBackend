const ConnectedConversation = require("../model/ConnectedConversation");
const useraccount = require("../model/useraccount");
const Message = require("../model/message")
exports.converstionid = async (req, res) => {
  const { senderId } = req.body;
  try {
    let authenicateid = await ConnectedConversation.findOne({members: senderId,});
    if (authenicateid !== null) {
      let authenicate = authenicateid.members.filter((item) => {
        return item !== senderId;
      });
      authenicate = await useraccount.findOne({ _id: authenicate });
      authenicateid = authenicateid._id.toString();
      if (authenicate !== null) {
        date = {
          username: authenicate.username,
          senderId,
          conversationId: authenicateid,
        };
        res.status(201).json(date);
      } else {
        res.status(201).json({ message: "No conversation Found" });
      }
    } else {
      res.status(201).json({ message: "No conversation Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.messages = async (req,res) =>{
    try {
        const {  senderId,ConversationID ,message} = req.body;
        let authenicate =  Message({
            ConversationID : ConversationID,
            senderId ,
            message
        })

        authenicate  = await authenicate.save();

        if(authenicate){
          res.status(200).json({message:"Message send Successfully"})
        }
        else{
          res.status(201).json({message:"Message send Successfully"})
        }
    } catch (error) {
        console.log(error)
    }
} 

exports.allmessage = async (req,res)=>{
  try {

    const {ConversationID} = req.params ;
    const authenticate = await Message.find({ConversationID});
     if(authenticate) {
      res.status(200).json ({authenticate});
     }
     else{
      res.status(200).json ({message: "No message"});
     }
  } catch (error) {
    console.log(error)
  }
}
