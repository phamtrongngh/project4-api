let express = require("express");
let router = express.Router();
let newfeedController = require("../controllers/newfeed.controller");
let upload = require("../controllers/upload.controller");
router.get("/",newfeedController.getNewfeeds);
router.get("/getMyNewfeeds",newfeedController.getMyNewfeeds);
router.get("/getListLike/:id",newfeedController.getListLike);
router.post("/postFoodNewFeed",newfeedController.createFoodNewfeed);
router.get("/:id", newfeedController.getNewfeed);
router.post("/",upload.single("image"),  newfeedController.createNewfeed);
router.put("/",upload.single("image"), newfeedController.updateNewfeed);
router.put("/changeActiveNewfeed/:id", newfeedController.changeActiveNewfeed)
router.delete("/:id", newfeedController.deleteNewfeed);
module.exports = router;