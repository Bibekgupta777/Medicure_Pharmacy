import express from 'express';
import Message from '../models/messageModel.js';

const router = express.Router();

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields (optional but recommended)
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      subject,
      message,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error, failed to save message' });
  }
});

// Get all messages (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await message.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

export default router;
