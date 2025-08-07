const express = require('express');
const DiaryEntry = require('../models/DiaryEntry.cjs');
const authenticateToken = require('../middleware/auth.cjs');

const router = express.Router();

// Get all diary entries for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ entries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single diary entry
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create diary entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, mood, tags, isPrivate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const entry = new DiaryEntry({
      title,
      content,
      mood: mood || 'content',
      tags: tags || [],
      isPrivate: isPrivate !== false,
      userId: req.user._id
    });

    await entry.save();
    res.status(201).json({ message: 'Entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update diary entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, mood, tags, isPrivate } = req.body;

    const entry = await DiaryEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, content, mood, tags, isPrivate, updatedAt: Date.now() },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete diary entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await DiaryEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;