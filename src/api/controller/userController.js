const User = require("../models/User");
const utils = require("../utils/utils");



exports.getUser = async (req, res, next) => {
  console.log(`geldi`)
  let username = req.params.username
    ? req.params.username.trim().toString()
    : undefined;

  let query = username ? { username } : {};

  try {
    let user = await User.find(query);
    console.log(user)
    return res.status(200).json(user);
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
    let { error, value } = utils.updateUserValidationSchema.validate(req.body);
    if (error) return res.status(404).json(error);

    let username = value.username ? value.username.toLowerCase() : undefined;
    let isUsernameUniq = username ? await User.exists({ username }) : false;

    let email = value.email ? value.email.toLowerCase() : undefined;
    let isMailUniq = email ? await User.exists({ email }) : false;
    let password = value.password;

    try {
      let updatedUser = await User.updateOne(
        { username: req.params.username.toLowerCase() },
        value
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(400).end;
    }
  } catch (error) {
    console.error(error);
    return res.status(400).end;
  }
};
