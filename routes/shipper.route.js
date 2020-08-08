let express = require("express");
let router = express.Router();
let shipperController = require("../controllers/shipper.controller");
let upload = require("../controllers/upload.controller");
router.get("/",shipperController.getShippers);
router.get("/getMyShipper", shipperController.getMyShipper);
router.get("/getMyOrders", shipperController.getMyOrders);
router.post("/", upload.single("avatar"), shipperController.createShipper)
router.post("/sendMyLocation", shipperController.sendMyLocation);
router.get("/getMyCompletedOrders", shipperController.getMyCompleteOrders)
router.get("/getMyFailedOrders", shipperController.getMyFailedOrders)
router.get("/:id", shipperController.getShipper);
router.post("/",shipperController.createShipper);
router.put("/changeActiveShipper/:id", shipperController.changeActiveShipper);
router.put("/",shipperController.updateShipper);
router.delete("/:id", shipperController.deleteShipper);
router.post("/acceptOrder/:id",shipperController.acceptOrder);
router.post("/deliveringOrder/:id",shipperController.deliveringOrder);
router.post("/completeOrder/:id",shipperController.completeOrder);
router.post("/cancelOrder/:id",shipperController.cancelOrder);
module.exports = router;