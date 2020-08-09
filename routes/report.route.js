let express = require("express");
let router = express.Router();
let reportController = require("../controllers/report.controller");

router.get("/",reportController.getReports);
router.get("/:id", reportController.getReport);
router.post("/", reportController.createReport);
router.put("/", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

module.exports = router;