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
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author"
    );
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete({
      _id: req.params.commentId,
    });
    res.status(200).json({ message: `Message has been deleted` });
  } catch (error) {}
};

exports.putComment = async (req, res) => {
  const comment = req.body.newText;
  try {
    await Comment.findByIdAndUpdate(
      { _id: req.params.commentId },
      {
        $set: { comment: comment },
      }
    );
    res.status(200).json({ message: `Comment uptaed succefully` });
  } catch (error) {
    console.log(error);
  }
};
