const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectRequestModel = new Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "interested", "ignored"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// schema validation pre
connectRequestModel.pre("save", function (next) {
  const connectionRequest = this;
  // check if the formUserId id same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Both id is same");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectRequestModel
);
module.exports = ConnectionRequest;
