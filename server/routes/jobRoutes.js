const express = require('express');
const { searchJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/search', searchJobs);

module.exports = router;
