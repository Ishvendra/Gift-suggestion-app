const multer = require("multer");
var path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, "profile-img-uploads");
    },
    filename: (req, file, cb)=>{
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
});

const fileFilter = (req, file, cb) => {
    // reject all files except jpeg and png
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        req.fileExtension = path.extname(file.originalname);
        cb(null, true);
    } else {
        req.fileValidationError = 'Invalid filetype. Use jpg or png.';
        cb(null, false, new Error('Invalid filetype. Use jpg or png.'));
    }
};

module.exports = multer({
storage: storage,
limits: {
    fileSize: 1024 * 1024 * 1, // 1mb max size,
    files: 1
}
,fileFilter: fileFilter,
});