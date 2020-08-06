const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
router.post("/login",authController.login);
router.post("/register",authController.register);
router.post("/loginAdmin",authController.loginAdmin);
router.post("/logout",authController.logout);
router.post("/loginShipper",authController.loginShipper);
router.post("/registerShipper",authController.registerShipper);
router.post("/logoutShipper",authController.logoutShipper)
module.exports = router;