let express = require("express");
let router = express.Router();
let userController = require("../controllers/user.controller.js");
let upload = require("../controllers/upload.controller");
router.get("/",userController.getUsers);
router.get("/getMyUser",userController.getMyUser);
router.get("/:id",userController.getUser);
router.put("/",upload.single("avatar"),userController.updateUser);
router.post("/requestFriend/:id",userController.requestFriend);
router.post("/cancelRequest/:id",userController.cancelRequest);
router.post("/acceptRequest/:id",userController.acceptRequest);
router.post("/comment/:id",userController.comment);


module.exports = router;
