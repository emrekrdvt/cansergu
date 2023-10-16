const User = require("../models/User");
const utils = require("../utils/utils");
var fs = require("fs");
const path = require("path");

exports.getUser = async (req, res, next) => {
  let username = req.params.username
    ? req.params.username.trim().toString()
    : undefined;

  let query = username ? { username } : {};

  try {
    let user = await User.find(query);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: error, error: 404 });
  }
};

exports.getRegexUser = async (req, res, next) => {

  try {
    const username = req.params.username.trim().toString();
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });
    if (!users || users.length == 0)
      return res
        .status(404)
        .json({ message: "Kullanıcı bulunamadı", error: 404 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ message: error, error: 404 });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let deleted = await User.deleteOne({
      username: req.params.username.toLowerCase(),
    });
    if (deleted) {
      return res
        .status(200)
        .json({ message: `${req.params.username} silindi.` });
    }
    throw new Error("Something went wrong during deletion");
  } catch (error) {
    console.error(error);
    return res.status(400).end;
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    var password;
    if (req.body.password === undefined) {
      var userx = await User.findOne({ username: req.body.username });
      password = userx.password;
    }

    let { error, value } = utils.updateUserValidationSchema.validate(req.body);
    console.log(`error yani`, error);
    if (error)
      return res.status(404).json({ message: `joi error =====> ${error} ` });

    let username = value.username ? value.username.toLowerCase() : undefined;
    let isUsernameUniq = username ? await User.exists({ username }) : false;

    let email = value.email ? value.email.toLowerCase() : undefined;
    let isMailUniq = email ? await User.exists({ email }) : false;
    password = value.password;

    try {
      await User.updateOne(
        { username: req.params.username.toLowerCase() },
        value
      );
      let resUser = await User.findOne({ username: req.body.username });
      const userWithoutPass = { ...resUser._doc };
      delete userWithoutPass.password;
      return res.status(200).json(userWithoutPass);
    } catch (error) {
      console.error(error);
      return res.status(400).end;
    }
  } catch (error) {
    console.error(error);
    return res.status(400).end;
  }
};

exports.userPhotoUpdate = async (req, res, next) => {
  const profilePic = req.file.filename;
  try {
    const user = await User.findOne({ username: req.params.username });
    /* const pPic = user.profilePic;
    var filePath = `/Users/emre/Desktop/cansergu/src/api/pics/${pPic}`;
    console.log(filePath);
    fs.unlinkSync(filePath); */
    await user.updateOne({ profilePic });
    res.status(200).json({ message: `Profile pic has been changed` });
  } catch (error) {
    console.log(error);
  }
};

exports.checkFollow = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.user });
    const curUser = await User.findOne({ username: req.body.curUser });

    //current userin followinginde user ara
    const isFollow = curUser.followings.includes(user._id);
    res.status(200).json(isFollow);
  } catch (error) {}
};

exports.followEvent = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.body.user._id });
    const curUser = await User.findById({ _id: req.body.currentUser._id });
    //current user followingsine useri- userin followerinina cuurent useri eklicem
    if (!curUser.followings.includes(user._id)) {
      await curUser.followings.push(user._id);
      await user.followers.push(curUser._id);
    } else {
      await curUser.followings.pull(user._id);
      await user.followers.pull(curUser._id);
    }
    await user.save();
    await curUser.save();
    res.status(200).json({ message: "Succes" });
  } catch (error) {}
};
