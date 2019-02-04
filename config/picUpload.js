const path = require('path');
const multer = require('multer');

const DIR = './profilePics/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            req.user.username +
                '-' +
                Date.now() +
                path.extname(file.originalname)
        );
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 // 1MB
    },
    fileFilter: fileFilter
}).single('photo');
