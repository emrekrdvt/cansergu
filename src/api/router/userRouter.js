const router = require("express").Router();
const userController = require("../controller/userController");

router.get("/:username?", userController.getUser);
router.delete("/:username", userController.deleteUser);
router.put("/:username", userController.updateUser);
router.post("/checkFollow", userController.checkFollow);
router.post("/followEvent", userController.followEvent);

module.exports = router;
