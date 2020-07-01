let express = require("express");
let router = express.Router();
let foodCategory = require("../controllers/foodCategory.controller");

router.get("/",foodCategory.getFoodCategorys);
router.get("/:id", foodCategory.getFoodCategory);
router.post("/",foodCategory.createFoodCategory);
router.put("/",foodCategory.updateFoodCategory);
router.delete("/:id", foodCategory.deleteFoodCategory);

module.exports = router;