let express = require("express");
let router = express.Router();
let restaurantController = require("../controllers/restaurant.controller");

let upload = require("../controllers/upload.controller");

let restaurantUpload = upload.single('avatar');

router.get("/",restaurantController.getRestaurants);
router.get("/:id", restaurantController.getRestaurant);
router.post("/",restaurantUpload , restaurantController.createRestaurant);
router.put("/",restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;