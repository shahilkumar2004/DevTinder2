const express = require("express");
const { useAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectinRequest");
const User = require("../models/user");

const requestRoutes = express.Router();

requestRoutes.post(
  "/request/send/:status/:toUserId",
  useAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = this.param.toUserId;
      const status = this.param.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).send.json({
          message: "invalid status type",
        });
      }

      const isIdPresent = await User.findById(toUserId);
      if (!isIdPresent) {
        return res.status(404).send.json({
          message: "toUserId is not present in the User ",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(404).send.json({
          message: "alresdy connection exist ",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + "is" + sattus + "in" + isIdPresent.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR" + err.message);
    }
  }
);

requestRoutes.post(
  "./request/review/:status/:requestId",
  useAuth,
  async (req, res) => {
    try {
      const loggdinUser = req.user;
      const fromUserId = this.param.requestId;
      const status = this.param.status;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).send.json({
          message: "invalid status type",
        });
      }

      // const isPresentUserId = await User.findById(fromUserId);
      // if (!isPresentUserId) {
      //   return res.status(404).send.json({
      //     message: "toUserId is not present in the User ",
      //   });
      // }

      const connectionRequest = await connectionRequest.findOne({
        toUserId: loggdinUser._id,
        _id: fromUserId,
        status: "interested",
      });


      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "the review request sent successfuly",
        data,
      });

    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);


 
module.exports = requestRoutes;
