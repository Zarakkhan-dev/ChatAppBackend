const express =require("express");
const router = express.Router();
const {converstionid,messages} = require("../controller/messages");

// POST Request 
router.post("/conversationid" ,converstionid )
router.post("/messages",messages)

module.exports = router