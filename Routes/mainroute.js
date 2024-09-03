const express = require("express");
const router = express.Router();
const User = require("./User")
const requestbox = require("./requestbox")
const message = require("./message");

router.use("/useraccount",User);
router.use("/requestbox",requestbox)
router.use("/message",message)

module.exports = router;