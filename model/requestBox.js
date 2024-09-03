const mongoose = require("mongoose");

const RequestBox = new mongoose.Schema({
   
   sendername:{
      type:String,
      required :[true,"UserName must be entered "]
   },
   email:{
      type:String,
      required :[true,"Email must be entered "]
   },
   requestsend :{
    type: Array,
    required : [true, "Receiver Name must be added"]
   }
})
module.exports = mongoose.model("Requestbox " , RequestBox );