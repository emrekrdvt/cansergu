const router = require("express").Router();
const postController = require("../controller/postController");
const multer = require("multer");

const postImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "post-images/"); // Resimlerin kaydedileceği klasörü belirtin
  },
  filename: (req, file, cb) => {
    // Dosya adı oluşturma mantığını burada belirleyebilirsiniz
    cb(null, "post-" + Date.now() + "-" + file.originalname);
  },
});

const postImageUpload = multer({ storage: postImageStorage });

router.post("/", postImageUpload.single("postImg"), postController.addPost);
router.get("/:userId?" , postController.userPosts);

module.exports = router;
