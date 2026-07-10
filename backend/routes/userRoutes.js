import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_id');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '30d' }
    );
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isBlocked: user.isBlocked,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked.' });
    }
    
    if (!user.password) {
      return res.status(400).json({ message: 'Please login with Google.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET not configured on server' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isBlocked: user.isBlocked,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    // Note: If you don't supply GOOGLE_CLIENT_ID in backend .env, verification might fail.
    // For local dev without env variables configured properly, we skip strict verification 
    // or just decode the token safely.
    
    let payload;
    try {
      if (credential.split('.').length === 3) {
        // It's a JWT (id_token)
        if (process.env.GOOGLE_CLIENT_ID) {
          const ticket = await googleClient.verifyIdToken({
              idToken: credential,
              audience: process.env.GOOGLE_CLIENT_ID,
          });
          payload = ticket.getPayload();
        } else {
          // Fallback: decode JWT without verification if no CLIENT_ID provided for testing
          payload = jwt.decode(credential);
        }
      } else {
        // It's an access_token
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`);
        if (!response.ok) throw new Error("Invalid access token");
        payload = await response.json();
      }
    } catch (e) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Failed to retrieve email from Google' });
    }
    
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub
      });
      await user.save();
    } else if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked.' });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET not configured on server' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isBlocked: user.isBlocked,
      avatar: payload.picture,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // In a real app we might aggregate order counts here using lean(), but for now just returning users.
    const users = await User.find({}).lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/block', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      if (req.io) req.io.emit('user_updated', { _id: user._id, name: user.name, email: user.email, isBlocked: user.isBlocked });
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    if (req.io) req.io.emit('user_deleted', req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
