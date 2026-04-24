const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const username = email.split('@')[0];
    const user = new User({ email, password, role, username });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email, role, username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Hardcoded bypass for demo/admin users
    const bypassUsers = {
      'admin': { role: 'admin', displayName: 'Administrator', email: 'admin@foodbridge.com' },
      'donor1': { role: 'donor', displayName: 'Donor Demo', email: 'donor1@test.com' },
      'ngo1': { role: 'ngo', displayName: 'NGO Demo', email: 'ngo1@test.com' }
    };

    if (bypassUsers[emailOrUsername] && password === (emailOrUsername === 'admin' ? 'admin123' : emailOrUsername + '23')) {
      const data = bypassUsers[emailOrUsername];
      // Create a stable mock ID
      const mockId = '00000000000000000000000' + (emailOrUsername === 'admin' ? '1' : emailOrUsername === 'donor1' ? '2' : '3');
      const token = jwt.sign({ id: mockId }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: mockId,
          email: data.email,
          username: emailOrUsername,
          role: data.role,
          displayName: data.displayName,
          needsProfile: false
        }
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        displayName: user.displayName,
        needsProfile: !user.displayName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a bypass user ID
    if (decoded.id.startsWith('00000000000000000000000')) {
      const idSuffix = decoded.id.slice(-1);
      const bypassUsers = {
        '1': { id: decoded.id, username: 'admin', role: 'admin', displayName: 'Administrator', email: 'admin@foodbridge.com' },
        '2': { id: decoded.id, username: 'donor1', role: 'donor', displayName: 'Donor Demo', email: 'donor1@test.com' },
        '3': { id: decoded.id, username: 'ngo1', role: 'ngo', displayName: 'NGO Demo', email: 'ngo1@test.com' }
      };
      return res.json(bypassUsers[idSuffix]);
    }

    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(decoded.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ONLY: Get all users
router.get('/all-users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let isAdmin = false;
    if (decoded.id.startsWith('00000000000000000000000')) {
      const idSuffix = decoded.id.slice(-1);
      if (idSuffix === '1') isAdmin = true;
    } else {
      const admin = await User.findById(decoded.id);
      if (admin && admin.role === 'admin') isAdmin = true;
    }

    if (!isAdmin) return res.status(403).json({ error: 'Access denied' });

    const users = await User.find().select('-password');
    // Map _id to id for frontend compatibility
    const formattedUsers = users.map(u => ({ ...u.toObject(), id: u._id }));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ONLY: Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (admin.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ONLY: Reset password
router.put('/users/:id/reset-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (admin.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const { password } = req.body;
    const user = await User.findById(req.params.id);
    user.password = password; // Pre-save hook will hash it
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ONLY: Create user
router.post('/admin-create-user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (admin.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const { email, password, role, displayName } = req.body;
    const username = email.split('@')[0];
    const user = new User({ email, password, role, displayName, username });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
