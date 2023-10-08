const router = require("express").Router();
const userController = require("../controller/userController");

router.get("/:username?", userController.getUser);
router.delete("/:username", userController.deleteUser);
router.put("/:username", userController.updateUser);

module.exports = router;
