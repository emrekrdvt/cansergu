const router = require("express").Router();
const userController = require("../controller/userController");
const multer = require("multer");

{
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "pics/");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + req.params.username + ".jpg");
    },
  });
  const updateProfilePic = multer({ storage });

  router.put(
    "/photo/:username",
    updateProfilePic.single("profilePic"),
    userController.userPhotoUpdate
  );
}

router.get("/:username?", userController.getUser);
router.get("/regex/:username?", userController.getRegexUser);
router.delete("/:username", userController.deleteUser);
router.put("/:username", userController.updateUser);
router.post("/checkFollow", userController.checkFollow);
router.post("/followEvent", userController.followEvent);

module.exports = router;
