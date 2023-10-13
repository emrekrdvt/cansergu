const router = require("express").Router();
const commentController = require("../controller/commentController");

router.post("/", commentController.addComment);
router.get("/:postId", commentController.getComment);

module.exports = router;
