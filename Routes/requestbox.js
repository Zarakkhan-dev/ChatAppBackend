const express =require("express");
const router = express.Router();
const {sendrequest,allsendrequest,pendingrequest,connectionconversation,cancelrequest} = require("../controller/requestBox");

// Get requests 
router.get("/allsendrequest/:email" , allsendrequest)
router.get("/pendingrequest/:email",pendingrequest)

// Post requests
router.post("/sendrequest" ,sendrequest);
router.post("/connectionconversation",connectionconversation);
router.post("/cancelrequest",cancelrequest)

module.exports = router