let express = require("express");
let router = express.Router();
let shipperController = require("../controllers/shipper.controller");

router.get("/",shipperController.getShippers);
router.get("/:id", shipperController.getShipper);
router.post("/",shipperController.createShipper);
router.put("/",shipperController.updateShipper);
router.delete("/:id", shipperController.deleteShipper);
router.post("/acceptOrder/:id",shipperController.acceptOrder);
router.post("/deliveringOrder/:id",shipperController.deliveringOrder);
router.post("/completeOrder/:id",shipperController.completeOrder);
router.post("/cancelOrder/:id",shipperController.cancelOrder);
module.exports = router;