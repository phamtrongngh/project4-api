let express = require("express");
let router = express.Router();
let productController = require("../controllers/product.controller");
let upload = require("../controllers/upload.controller");

router.get("/",productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", upload.single("image"), productController.createProduct);
router.put("/",upload.single("image"),productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;