let express = require("express");
let router = express.Router();
let productController = require("../controllers/product.controller");

router.get("/",productController.getProducts);
router.get("/:id", productController.getProducts);
router.post("/",productController.createProduct);
router.put("/",productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;