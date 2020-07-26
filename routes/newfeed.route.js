let express = require("express");
let router = express.Router();
let newfeedController = require("../controllers/newfeed.controller");

router.get("/",newfeedController.getNewfeeds);
router.post("/postFoodNewFeed",newfeedController.createFoodNewfeed);
router.get("/:id", newfeedController.getNewfeed);
router.post("/",  newfeedController.createNewfeed);
router.put("/",newfeedController.updateNewfeed);
router.delete("/:id", newfeedController.deleteNewfeed);
module.exports = router;