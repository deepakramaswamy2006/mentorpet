const Note = require('../models/Note');
const pdf = require('pdf-parse');
const { getChatCompletion } = require('../services/aiService');
const fs = require('fs');

// @desc    Upload and Analyze PDF
// @route   POST /api/notes/upload
// @access  Private
exports.uploadNote = async (req, res) => {
  console.log('--- START UPLOAD PROCESS ---');
  try {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);
    console.log('Path:', req.file.path);

    let dataBuffer;
    try {
      dataBuffer = fs.readFileSync(req.file.path);
      console.log('File read into buffer');
    } catch (readErr) {
      console.error('File Read Error:', readErr);
      throw new Error('Failed to read uploaded file');
    }

    let pdfData;
    try {
      pdfData = await pdf(dataBuffer);
      console.log('PDF parsed successfully');
    } catch (parseErr) {
      console.error('PDF Parse Error:', parseErr);
      throw new Error('Failed to parse PDF content. The file might be corrupted.');
    }

    const extractedText = pdfData.text;
    if (!extractedText || extractedText.trim().length === 0) {
      console.log('No text extracted');
      throw new Error('Could not extract text from the PDF. The file might be scanned or empty.');
    }

    console.log('Extracted text length:', extractedText.length);

    // Generate Summary using AI with fallback
    let summary = 'Summary generation failed, but the document was uploaded successfully.';
    try {
      console.log('Attempting AI summary...');
      const messages = [
        { role: 'system', content: 'You are an academic assistant. Summarize the following document content into key highlights, main topics, and actionable insights. Be professional and structured.' },
        { role: 'user', content: extractedText.substring(0, 8000) }
      ];
      summary = await getChatCompletion(messages);
      console.log('AI summary generated');
    } catch (aiErr) {
      console.error('AI Summary Error:', aiErr);
    }

    console.log('Saving to database...');
    const note = await Note.create({
      user: req.user.id,
      title: req.file.originalname,
      content: extractedText,
      summary: summary,
      filename: req.file.filename
    });
    console.log('Database entry created');

    // Delete temp file after processing
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Temp file deleted');
    }

    res.status(201).json({ success: true, data: note });
  } catch (err) {
    console.error('UPLOAD CATCH BLOCK:', err);
    // Cleanup file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Temp file cleaned up after error');
      } catch (cleanupErr) {
        console.error('Cleanup Error:', cleanupErr);
      }
    }
    res.status(500).json({ success: false, message: err.message || 'Server error during upload' });
  } finally {
    console.log('--- END UPLOAD PROCESS ---');
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
