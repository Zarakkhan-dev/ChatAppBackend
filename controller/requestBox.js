const RequestBox = require("../model/requestBox");
const user = require("../model/useraccount");
const ConnectedConversation = require("../model/ConnectedConversation");
const express = require("express");
exports.sendrequest = async (req, res) => {
  const { sendername, email, requestreceipt, username } = req.body;

try {
  // Check if there's already a RequestBox for the sender's email
  let senderRequestBox = await RequestBox.findOne({ email });

  // Check if a request from sender to receiver already exists
  let isRequestAlreadySent = senderRequestBox && senderRequestBox.requestsend.some(
    (item) => item.requestreceipt === requestreceipt
  );


  let receiverRequestBox = await RequestBox.findOne({ email: requestreceipt });
  let isRequestAlreadyReceived = receiverRequestBox && receiverRequestBox.requestsend.some(
    (item) => item.requestreceipt === email
  );

  if (isRequestAlreadySent || isRequestAlreadyReceived) {
 
    return res.status(202).json({ message: "Request already sent or received" });
  }

  if (!senderRequestBox) {
    senderRequestBox = new RequestBox({
      sendername,
      email,
      requestsend: [{ requestreceipt, username, status: "pending" }],
    });
    await senderRequestBox.save();
  } else {
  
    await RequestBox.findOneAndUpdate(
      { email },
      {
        $push: {
          requestsend: { requestreceipt, username, status: "pending" },
        },
      }
    );
  }

  return res.status(201).json({ message: "Send request successfully" });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
};

exports.allsendrequest = async (req, res) => {
  const { email } = req.params;
  try {
    let authenicate = await RequestBox.findOne({ email });
    if (authenicate !== null) {
      res.status(200).json({ pendingrequests: authenicate.requestsend });
    } else {
      res.status(201).json({ message: "no request send " });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.pendingrequest = async (req, res) => {
  try {
    const { email } = req.params;
    const requestreceipt = email;
    let authenicate = await RequestBox.find({
      "requestsend.requestreceipt": requestreceipt,
    }).select("email").select("sendername");
    if (authenicate.length > 0) {
      res.status(200).json({ friends: authenicate });
    } else {
      res.status(201).json({ message: "No pending Request" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.connectionconversation = async (req, res) => {
  try {
    const { userId, requestreceipt,receiveremail } = req.body;
    let requestreceiptID = await user
      .findOne({
        email: requestreceipt,
      })
      .select("_id");

    requestreceiptID = requestreceiptID._id.toString();
    if (requestreceiptID) {
      let autenticate = ConnectedConversation({
        members: [
          requestreceiptID , userId],
      });
      await autenticate.save();
      autenticate = await RequestBox.updateOne(
        { email:requestreceipt },
        {
          $pull: { requestsend: { requestreceipt:receiveremail } },
        }
      );
    if (autenticate.modifiedCount !==0){
      res.status(200).json({ message: "Friend request accept" });
    }
    else{
      res.status(201).json({ message: "Already Accepted" })
    }
    }
  } catch (error) {
    console.log(error);
  }
};
exports.cancelrequest =async (req,res)=>{
  try {
    const {email,receiptemail } = req.body;
      let autenticate = await RequestBox.updateOne(
        { email },
        {
          $pull: { requestsend: { requestreceipt :receiptemail } },
        }
      );
      if(autenticate.modifiedCount !==0){
        res.status(200).json({message:"request cancel"})
      }
      else{
        res.status(302).json({message:"Something went wrong "})
      }
  } catch (error) {
    console.log(error);
  }
}