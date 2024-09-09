const express =require("express");
const router = express.Router();
const {converstionid,messages, allmessage} = require("../controller/messages");

// POST Request 
router.post("/conversationid" ,converstionid )
router.post("/messages",messages)
router.get("/messages/:ConversationID",allmessage )
module.exports = router