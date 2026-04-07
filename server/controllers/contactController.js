const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
exports.submitContactForm = async (req, res) => {
  const { name, email, category, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message' });
  }

  try {
    const contact = await Contact.create({
      name,
      email,
      category,
      message
    });

    if (contact) {
      res.status(201).json({
        message: 'Message broadcast successfully!',
        contactId: contact._id
      });
    } else {
      res.status(400).json({ message: 'Failed to process inquiry' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
