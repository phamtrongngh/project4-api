let express = require("express");
let router = express.Router();
let userController = require("../controllers/user.controller.js");


router.post("/login",userController.login);
router.get("/",userController.getUser);
router.post("/register",userController.register);
router.post("/logout",userController.logout);
module.exports = router;
