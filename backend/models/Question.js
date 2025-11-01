const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'number', 'boolean', 'select'],
    default: 'text',
  },
  options: [String], // For select type
  required: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);
