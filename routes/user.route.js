let express = require("express");
let router = express.Router();
let userController = require("../controllers/user.controller.js");
router.get("/",userController.getUser);
router.post("/",userController.register);
module.exports = router;
