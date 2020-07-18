let express = require("express");
let router = express.Router();
let newfeedController = require("../controllers/newfeed.controller");
let upload = require("../controllers/upload.controller");

let newfeedUpload = upload.single('images');

router.get("/",newfeedController.getNewfeeds);
router.get("/:id", newfeedController.getNewfeed);
router.post("/", newfeedUpload, newfeedController.createNewfeed);
router.put("/",newfeedController.updateNewfeed);
router.delete("/:id", newfeedController.deleteNewfeed);

module.exports = router;