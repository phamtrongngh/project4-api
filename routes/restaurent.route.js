let express = require("express");
let router = express.Router();
let restaurantController = require("../controllers/restaurant.controller");

let upload = require("../controllers/upload.controller");

router.get("/getMyRestaurants",restaurantController.getMyRestaurants);
router.get("/paying/:id",restaurantController.paying);
router.get("/manageMyRestaurant/:id",restaurantController.manageMyRestaurant);
router.get("/",restaurantController.getRestaurants);
router.get("/getMenu/:id",restaurantController.getMenu);
router.get("/:id", restaurantController.getRestaurant);
router.post("/",upload.any(), restaurantController.createRestaurant);
router.put("/",upload.any(),restaurantController.updateRestaurant);
router.put("/changeActiveRestaurant/:id", restaurantController.changeActiveRestaurant);
router.put("/changeVerifyRestaurant/:id", restaurantController.changeVerifyRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;