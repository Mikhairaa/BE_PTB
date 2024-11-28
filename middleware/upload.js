const multer = require('multer');
const path = require('path');

// Tentukan tempat penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Simpan file di folder uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nama file unik berdasarkan timestamp
  }
});

// Filter untuk menerima hanya foto dan video
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|mp4|avi/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);  // File valid
  } else {
    cb('Error: File must be a photo or video');  // File tidak valid
  }
};

// Middleware upload untuk foto dan video
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
