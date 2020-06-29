let express = require("express");
let router = express.Router();
let restaurentController = require("../controllers/restaurent.controller");

router.get("/",restaurentController.getRestaurents);
router.get("/:id", restaurentController.getRestaurent);
router.post("/",restaurentController.createRestaurent);
router.put("/",restaurentController.updateRestaurent);
router.delete("/:id", restaurentController.deleteRestaurent);

module.exports = router;