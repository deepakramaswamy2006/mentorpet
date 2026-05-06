const express = require('express');
const { chatWithTutor, summarizeNotes, generateQuiz, generateRoadmap } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/tutor', chatWithTutor);
router.post('/summarize', summarizeNotes);
router.post('/quiz', generateQuiz);
router.post('/roadmap', generateRoadmap);

module.exports = router;
