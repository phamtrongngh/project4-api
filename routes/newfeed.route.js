let express = require("express");
let router = express.Router();
let newfeedController = require("../controllers/newfeed.controller");
const { route } = require("./user.route");
router.get("/",newfeedController.getNewfeeds);
router.post("/",newfeedController.createNewfeed);
router.put("/:id",newfeedController.updateNewfeed);
router.delete("/:id", newfeedController.deleteNewfeed);

module.exports = router;