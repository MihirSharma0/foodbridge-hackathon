const express = require('express');
const Donation = require('../models/Donation.cjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create donation
router.post('/', auth, async (req, res) => {
  try {
    const donation = new Donation({
      ...req.body,
      donorId: req.userId
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request pickup (NGO)
router.patch('/:id/request', auth, async (req, res) => {
  try {
    const { ngoName } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        status: 'requested',
        requestedBy: req.userId,
        requestedByName: ngoName,
        requestedAt: new Date()
      },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as collected
router.patch('/:id/collect', auth, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'collected' },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel donation/request
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const { role } = req.body; // 'donor' or 'ngo'
    let update = {};
    if (role === 'ngo') {
      update = { status: 'available', requestedBy: null, requestedByName: null, requestedAt: null };
    } else {
      update = { status: 'cancelled' };
    }
    const donation = await Donation.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete donation
router.delete('/:id', auth, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
