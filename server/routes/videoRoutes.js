const express = require('express');
const { searchVideos } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/search', searchVideos);

module.exports = router;
