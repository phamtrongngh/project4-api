let multer = require('multer')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/image/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});

let upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }
});


module.exports = upload;