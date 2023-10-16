const router = require("express").Router();
const commentController = require("../controller/commentController");

router.post("/", commentController.addComment);
router.get("/:postId", commentController.getComment);
router.delete("/:commentId", commentController.deleteComment);
router.put("/:commentId", commentController.putComment);

module.exports = router;
