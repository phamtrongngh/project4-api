let express = require("express");
let router = express.Router();
let userController = require("../controllers/user.controller.js");
router.get("/",userController.getUsers);
router.put("/",userController.updateUser);
router.post("/requestFriend/:id",userController.requestFriend);
router.post("/cancelRequest/:id",userController.cancelRequest);
router.post("/acceptRequest/:id",userController.acceptRequest);
module.exports = router;
