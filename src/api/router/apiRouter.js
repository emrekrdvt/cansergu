const router = require("express").Router();

const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const commentRouter = require("./commentRouter");
const authRouter = require("./authRouter");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

module.exports = router;
