let express = require("express");
let router = express.Router();
let orderController = require("../controllers/order.controller");

router.get("/",orderController.getOrders);
router.get("/orderfinding",orderController.getFindingOrders);
router.get("/:id", orderController.getOrder);
router.post("/",orderController.createOrder);
router.put("/",orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;