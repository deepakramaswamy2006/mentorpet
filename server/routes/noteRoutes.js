const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadNote, getNotes, askAboutNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const fs = require('fs');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf' && ext !== '.txt' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only documents are allowed'));
    }
    cb(null, true);
  }
});

router.use(protect);

router.get('/', getNotes);
router.post('/upload', upload.single('file'), uploadNote);
router.post('/:id/ask', askAboutNote);
router.delete('/:id', deleteNote);

module.exports = router;
