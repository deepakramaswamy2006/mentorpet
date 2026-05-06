const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  content: {
    type: String, // Extracted text from PDF
    required: true
  },
  summary: {
    type: String
  },
  filename: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);
