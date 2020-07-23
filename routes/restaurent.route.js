let express = require("express");
let router = express.Router();
let restaurantController = require("../controllers/restaurant.controller");

let upload = require("../controllers/upload.controller");

router.get("/getMyRestaurants",restaurantController.getMyRestaurants);
router.get("/manageMyRestaurant/:id",restaurantController.manageMyRestaurant);
router.get("/",restaurantController.getRestaurants);
router.get("/:id", restaurantController.getRestaurant);
router.post("/",upload.any(), restaurantController.createRestaurant);
router.put("/",restaurantController.updateRestaurant);

router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;