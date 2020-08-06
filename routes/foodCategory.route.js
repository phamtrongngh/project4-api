let express = require("express");
let router = express.Router();
let foodCategory = require("../controllers/foodCategory.controller");
let upload = require("../controllers/upload.controller");

router.get("/",foodCategory.getFoodCategorys);
router.get("/:id", foodCategory.getFoodCategory);
router.post("/",upload.single("image"),foodCategory.createFoodCategory);
router.put("/",upload.single("image"),foodCategory.updateFoodCategory);
router.delete("/:id", foodCategory.deleteFoodCategory);

module.exports = router;