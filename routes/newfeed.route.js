let express = require("express");
let router = express.Router();
let newfeedController = require("../controllers/newfeed.controller");
var multer  = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/image')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
});
let fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpg'){
        cb(null, true)
    }
    else {cb(null, false)}  
};

let upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}, fileFilter});
let newfeedUpload = upload.single('images');

router.get("/",newfeedController.getNewfeeds);
router.get("/:id", newfeedController.getNewfeed);
router.post("/", newfeedUpload, newfeedController.createNewfeed);
router.put("/",newfeedController.updateNewfeed);
router.delete("/:id", newfeedController.deleteNewfeed);

module.exports = router;