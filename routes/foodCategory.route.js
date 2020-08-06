let express = require("express");
let router = express.Router();
let foodCategory = require("../controllers/foodCategory.controller");
let upload = require("../controllers/upload.controller");
<<<<<<< HEAD

router.get("/",foodCategory.getFoodCategorys);
router.get("/:id", foodCategory.getFoodCategory);
router.post("/",upload.single("image"), foodCategory.createFoodCategory);
router.put("/",foodCategory.updateFoodCategory);
=======
router.get("/",foodCategory.getFoodCategorys);
router.get("/:id", foodCategory.getFoodCategory);
router.post("/",upload.single("image"),foodCategory.createFoodCategory);
router.put("/",upload.single("image"),foodCategory.updateFoodCategory);
>>>>>>> 610db8a847bc01ef5a1d3ffa4120e2e593ee41fe
router.delete("/:id", foodCategory.deleteFoodCategory);

module.exports = router;