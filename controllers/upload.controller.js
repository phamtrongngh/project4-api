let multer  = require('multer')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/image')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    }
});
let fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else {cb(null, false)}  
};

let upload = multer({ storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}, fileFilter});

module.exports = upload;