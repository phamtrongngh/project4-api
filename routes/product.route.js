let express = require("express");
let router = express.Router();
let productController = require("../controllers/product.controller");
let upload = require("../controllers/upload.controller");

let productUpload = upload.single('images');

router.get("/",productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", productUpload, productController.createProduct);
router.put("/",productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;