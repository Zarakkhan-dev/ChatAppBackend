const express =require("express");
const router = express.Router();
const {userSignup,userSignin,detailuser,allavailableuserforfriendrequest,friendlist} = require("../controller/Userdata")


router.post("/signup",userSignup)
router.post("/login", userSignin)
router.post("/tokenverify" ,detailuser)
router.get("/allavailableuserforfriendrequest/:email",allavailableuserforfriendrequest)
router.get("/friendlist/:userid" ,friendlist)
module.exports = router;
