const Note = require('../models/Note');
const pdf = require('pdf-parse');
const { getChatCompletion } = require('../services/aiService');
const fs = require('fs');

// @desc    Upload and Analyze PDF
// @route   POST /api/notes/upload
// @access  Private
exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    // Generate Summary using AI
    const messages = [
      { role: 'system', content: 'You are an academic assistant. Summarize the following document content into key highlights, main topics, and actionable insights. Be professional and structured.' },
      { role: 'user', content: extractedText.substring(0, 8000) } // Truncate if too long for token limit
    ];

    const summary = await getChatCompletion(messages);

    const note = await Note.create({
      user: req.user.id,
      title: req.file.originalname,
      content: extractedText,
      summary: summary,
      filename: req.file.filename
    });

    // Delete temp file after processing
    fs.unlinkSync(req.file.path);

    res.status(201).json({ success: true, data: note });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all user notes
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Ask questions about a note
// @route   POST /api/notes/:id/ask
// @access  Private
exports.askAboutNote = async (req, res) => {
  try {
    const { question } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const messages = [
      { role: 'system', content: `You are an expert tutor. Answer the user's question based strictly on the following document context:\n\n${note.content.substring(0, 15000)}` },
      { role: 'user', content: question }
    ];

    const answer = await getChatCompletion(messages);
    res.status(200).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    await note.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
