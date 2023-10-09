const { date } = require("joi");
const Post = require("../models/Post");
const User = require("../models/User");

exports.addPost = async (req, res) => {
  try {
    // body authorID,desc,img
    const newPost = new Post({
      author: req.body.authorId,
      desc: req.body.desc,
      img: req.file.filename,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

exports.userPosts = async (req, res) => {
  let author = req.params.userId ? req.params.userId : undefined;
  let query = author ? { author } : {};

  try {
    let userPosts = await Post.find(query)
      .populate("author")
      .sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (error) {
    return res.status(404).json({ message: error, error: 404 });
  }
};

exports.likeEvent = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const updatePost = await Post.findOne({ _id: req.params.postId }).populate(
      "likes"
    );

    if (updatePost.likes.some((item) => item.username === user.username)) {
      updatePost.likes.pull(user._id);
    } else {
      updatePost.likes.push(user._id);
    }
    await updatePost.save();
  } catch (error) {
    console.log(error);
  }
};
