let express = require("express");
let router = express.Router();
let userController = require("../controllers/user.controller.js");
let upload = require("../controllers/upload.controller");

router.get("/", userController.getUsers);
router.get("/search/:keyword", userController.search);
router.get("/searchAll/:keyword", userController.searchAll);
router.post("/switchCart", userController.switchCart);
router.post("/addToCart", userController.addToCart);
router.post("/sendRouteToShipper", userController.sendRouteToShipper);
router.get("/getNotifications", userController.getNotifications);
router.get("/getFriendRequests", userController.getFriendRequests);
router.delete("/removeFromCart/:id", userController.removeFromCart);
router.get("/getMyUser", userController.getMyUser);
router.get("/getCart", userController.getCart);
router.get("/:id", userController.getUser);
router.put("/", upload.single("avatar"), userController.updateUser);
router.post("/requestFriend/:id", userController.requestFriend);
router.post("/cancelRequest/:id", userController.cancelRequest);
router.post("/acceptRequest/:id", userController.acceptRequest);
router.post("/comment/", userController.comment);
router.post("/follow/", userController.follow);
router.post("/like/:id", userController.like);


module.exports = router;
