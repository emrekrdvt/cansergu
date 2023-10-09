const User = require("../models/User");
const utils = require("../utils/utils");
const uuid = require("uuid");

exports.signup = async (req, res) => {
  let profilePic;
  let validateBody = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  let { error, value } =
    utils.createUserValidationSchema.validate(validateBody);
  if (error) return res.status(404).json(error);

  let username = value.username.toLowerCase();
  let isUsernameUniq = await User.exists({ username });

  let email = value.email ? value.email.toLowerCase() : undefined;
  let isMailUniq = email ? await User.exists({ email }) : false;

  let password = value.password;
  if (req.file) {
    profilePic = req.file.filename;
  } else profilePic = null;

  const token = uuid.v4();

  try {
    if (isUsernameUniq || isMailUniq) {
      message = isUsernameUniq ? "This username already taken!" : "";
      message += isMailUniq ? "\nThis email already taken!" : "";
      return res.status(400).json({ message, error: 400 });
    } else {
      var newUser = await User.create({
        username,
        password,
        email,
        profilePic,
        token,
      });
      await newUser.save();
      res.status(200).json(newUser);
      await utils.sendMail(email, token);
    }
  } catch (error) {
    console.error(`ben geldim amk`, error);
  }
};

exports.verify = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          isAuth: true,
        },
        $unset: {
          token: "",
        },
      },
      { new: true }
    );

    res
      .status(200)
      .redirect("http://localhost:5500/src/client/views/verifyMail.html");
  } catch (error) {
    throw error;
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send("user not found");

    const validPass = user.password === req.body.password;
    if (!validPass) return res.status(404).send("sifre yanlis");

    if (validPass) {
      const userWithoutPass = { ...user._doc };
      delete userWithoutPass.password;
      return res.status(200).json(userWithoutPass);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
