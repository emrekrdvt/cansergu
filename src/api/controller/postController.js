const Post = require("../models/Post");

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
    let userPosts = await Post.find(query).populate('author');
    res.status(200).json(userPosts)
  } catch (error) {
    return res.status(404).json({ message: error, error: 404 });
  }
};
