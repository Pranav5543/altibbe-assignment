const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/questions
// @desc    Get all questions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/questions/:id
// @desc    Get question by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/questions
// @desc    Create a question
// @access  Private (Admin only)
router.post('/', [
  auth,
  adminAuth,
  body('text', 'Text is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text, type, options, required, category } = req.body;

  try {
    const newQuestion = new Question({
      text,
      type: type || 'text',
      options: options || [],
      required: required || false,
      category,
    });

    const question = await newQuestion.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/questions/:id
// @desc    Update a question
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  adminAuth,
  body('text', 'Text is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text, type, options, required, category } = req.body;

  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: { text, type, options, required, category } },
      { new: true }
    );

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/questions/:id
// @desc    Delete a question
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await Question.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
