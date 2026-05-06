const { getChatCompletion } = require('../services/aiService');
const { YoutubeTranscript } = require('youtube-transcript');

// Helper to extract YouTube Video ID
const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// @desc    Ask AI Tutor
// @route   POST /api/ai/tutor
// @access  Private
exports.chatWithTutor = async (req, res) => {
  try {
    let { message, history } = req.body;
    
    // Check if message contains a YouTube link
    const youtubeId = getYoutubeId(message);
    let transcriptData = '';
    
    if (youtubeId) {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(youtubeId);
        // Truncate transcript to ~6000 words to avoid Groq TPM limits
        transcriptData = transcript.map(t => t.text).join(' ').substring(0, 25000); 
        message = `User has provided a YouTube video link. Please summarize this video based on its transcript (truncated if very long):\n\nTRANSCRIPT:\n${transcriptData}\n\nUSER QUESTION/MESSAGE: ${message}`;
      } catch (err) {
        console.error('Transcript Fetch Error:', err);
        // If transcript fails, we just proceed with the original message
      }
    }
    
    const messages = [
      { role: 'system', content: 'You are MENTORPET AI, a helpful and knowledgeable academic tutor. If a transcript is provided, summarize it clearly with key takeaways, main concepts, and a concise conclusion. Otherwise, help students understand concepts, solve problems, and provide study guidance. Be concise, professional, and encouraging.' },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const response = await getChatCompletion(messages, 'llama-3.3-70b-versatile');
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.error('AI Tutor Error:', err);
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

// Helper to parse JSON from AI response (handles markdown blocks and <think> tags)
const parseAIJSON = (content) => {
  try {
    // 1. Strip DeepSeek thinking blocks if present
    const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    
    // 2. Try direct parse
    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      // 3. Try regex extraction
      const jsonMatch = cleanContent.match(/```json\n?([\s\S]*?)\n?```/) || cleanContent.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const potentialJSON = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(potentialJSON.trim());
      }
      throw new Error('No valid JSON found in AI response');
    }
  } catch (err) {
    console.error('JSON Parse Error. Content was:', content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

// @desc    Generate Quiz
// @route   POST /api/ai/quiz
// @access  Private
exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    const messages = [
      { role: 'system', content: 'You are an expert academic professor. Your task is to generate a STRICTLY RELEVANT and scientifically accurate quiz based on the provided topic. Do not deviate from the subject or include unrelated general knowledge. Generate exactly 10 high-quality MCQs. Each question must have 4 plausible options, but ONLY ONE must be factually correct. RANDOMIZE the position of the correct answer among the options. Return ONLY a pure JSON object in this format: { "quizzes": [{ "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": "string" }] }. No markdown, no thinking, no extra text.' },
      { role: 'user', content: `STRICT TOPIC: ${topic}\nDIFFICULTY LEVEL: ${difficulty}` }
    ];

    const response = await getChatCompletion(messages, 'llama-3.3-70b-versatile');
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
