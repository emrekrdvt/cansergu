const router = require("express").Router();
const authControler = require("../controller/authController");
const multer = require("multer");

router.post("/login", authControler.login);

 {
  const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "pics/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + req.body.username + ".jpg");
  },
});
const upload = multer({ storage });
router.post("/signup", upload.single("profilePic"), authControler.signup);
} 
module.exports = router;
