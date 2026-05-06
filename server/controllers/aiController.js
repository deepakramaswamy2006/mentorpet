const { getChatCompletion } = require('../services/aiService');

// @desc    Ask AI Tutor
// @route   POST /api/ai/tutor
// @access  Private
exports.chatWithTutor = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    const messages = [
      { role: 'system', content: 'You are MENTORPET AI, a helpful and knowledgeable academic tutor. Your goal is to help students understand concepts, solve problems, and provide study guidance. Be concise, professional, and encouraging.' },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const response = await getChatCompletion(messages);
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Summarize Notes
// @route   POST /api/ai/summarize
// @access  Private
exports.summarizeNotes = async (req, res) => {
  try {
    const { content } = req.body;
    
    const messages = [
      { role: 'system', content: 'You are an expert summarizer. Provide a concise summary of the following notes, extracting key points, definitions, and actionable study goals.' },
      { role: 'user', content: content }
    ];

    const response = await getChatCompletion(messages, 'llama-3.1-8b-instant');
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Helper to parse JSON from AI response (handles markdown blocks)
const parseAIJSON = (content) => {
  try {
    // If it's already pure JSON
    return JSON.parse(content);
  } catch (e) {
    // Try to extract JSON from code blocks
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    throw new Error('Failed to parse AI JSON response');
  }
};

// @desc    Generate Quiz
// @route   POST /api/ai/quiz
// @access  Private
exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    const messages = [
      { role: 'system', content: 'You are a quiz generator. Generate 5 multiple-choice questions (MCQs) on the given topic. Return only a pure JSON object: { "quizzes": [{ "question": "", "options": ["", "", "", ""], "correctAnswer": "" }] }' },
      { role: 'user', content: `Topic: ${topic}, Difficulty: ${difficulty}` }
    ];

    const response = await getChatCompletion(messages, 'deepseek-r1-distill-llama-70b');
    res.status(200).json({ success: true, data: parseAIJSON(response) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Generate Roadmap
// @route   POST /api/ai/roadmap
// @access  Private
exports.generateRoadmap = async (req, res) => {
  try {
    const { goal } = req.body;
    
    const messages = [
      { role: 'system', content: 'You are a learning path architect. Create a detailed visual roadmap for the given goal. Break it down into phases: Beginner, Intermediate, and Advanced. Return only a pure JSON object: { "phases": [{ "name": "", "steps": [{ "title": "", "description": "" }] }] }' },
      { role: 'user', content: `Goal: ${goal}` }
    ];

    const response = await getChatCompletion(messages);
    res.status(200).json({ success: true, data: parseAIJSON(response) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
