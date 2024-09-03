const mongoose = require("mongoose");

const ChatMessage = new mongoose.Schema({
    ConversationID : {
        type:String,
        required : [true , "Conversation Id must insert "]
    },
    senderId :{
        type:String,
        required : [true , "Sender Id must insert "]
    },
    message:String
})
module.exports = mongoose.model("Message" , ChatMessage);