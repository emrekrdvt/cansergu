const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    await Comment.create({
      author: req.body.author,
      post: req.body.postId,
      comment: req.body.comment,
    });
    res.status(201).json({ message: `Comment sent successfully` });
  } catch (error) {
    throw error;
  }
};

//router.get("/:postId", commentController.getComment)

exports.getComment = async (req, res) => {
    try {
        const comments = await Comment.find({post: req.params.postId}).populate('author')
        res.status(200).json(comments)
    } catch (error) {
        console.log(error)
    }
};
