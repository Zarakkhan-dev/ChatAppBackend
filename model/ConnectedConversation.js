const mongoose = require("mongoose");


const ConnectedConversation = new mongoose.Schema({
    members:{
        type:Array,
        required : [true , "Conversation ID must be "]
    }

})
module.exports = mongoose.model("ConnectedConversation" ,ConnectedConversation);