let express = require("express");
let router = express.Router();
let newfeedController = require("../controllers/newfeed.controller");
const { route } = require("./user.route");
router.get("/",newfeedController.getNewfeeds);
router.get("/:id", newfeedController.getNewfeed);
router.post("/",newfeedController.createNewfeed);
router.put("/",newfeedController.updateNewfeed);
router.delete("/:id", newfeedController.deleteNewfeed);

module.exports = router;