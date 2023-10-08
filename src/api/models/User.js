const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    followings: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
