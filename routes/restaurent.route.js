let express = require("express");
let router = express.Router();
let restaurantController = require("../controllers/restaurant.controller");

router.get("/",restaurantController.getRestaurants);
router.get("/:id", restaurantController.getRestaurant);
router.post("/",restaurantController.createRestaurant);
router.put("/",restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;