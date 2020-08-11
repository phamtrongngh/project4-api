let express = require("express");
let router = express.Router();
let orderController = require("../controllers/order.controller");

router.get("/",orderController.getOrders);
router.get("/orderfinding",orderController.getFindingOrders);
router.post("/rate",orderController.rate);
router.post("/cancelOrder/:id",orderController.cancelOrder);
router.get("/paying/:id",orderController.paying);
router.get("/:id", orderController.getOrder);
router.post("/",orderController.createOrder);
router.put("/",orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.post("/fakeorder", orderController.fakeOrder);
module.exports = router;