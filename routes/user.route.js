let express = require("express");
let router = express.Router();
let userController = require("../controllers/user.controller.js");
const { route } = require("./newfeed.route.js");
router.get("/",userController.getUsers);
router.get("/:id",userController.getUser);
router.put("/",userController.updateUser);
router.post("/requestFriend/:id",userController.requestFriend);
router.post("/cancelRequest/:id",userController.cancelRequest);
router.post("/acceptRequest/:id",userController.acceptRequest);
module.exports = router;
