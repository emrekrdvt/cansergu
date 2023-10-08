const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
