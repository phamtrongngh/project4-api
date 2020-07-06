let express = require("express");
let router = express.Router();
let shipperController = require("../controllers/shipper.controller");

router.get("/",shipperController.getShippers);
router.get("/:id", shipperController.getShipper);
router.post("/",shipperController.createShipper);
router.put("/",shipperController.updateShipper);
router.delete("/:id", shipperController.deleteShipper);

module.exports = router;