import express from 'express';
import jwt from 'jsonwebtoken';
import { protect, adminOnly } from '../middleware/auth.js';
import Admin from '../models/Admin.js';

const router = express.Router();

router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    let payload;
    try {
      if (credential.split('.').length === 3) {
        if (process.env.GOOGLE_CLIENT_ID) {
          const { OAuth2Client } = await import('google-auth-library');
          const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          payload = ticket.getPayload();
        } else {
          payload = jwt.decode(credential);
        }
      } else {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`);
        if (!response.ok) throw new Error('Invalid access token');
        payload = await response.json();
      }
    } catch (e) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Failed to retrieve email from Google' });
    }

    const admin = await Admin.findOne({ email: payload.email }).lean();
    if (!admin) {
      return res.status(403).json({ message: 'Access denied. Admin account not found.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET not configured on server' });
    }
    const token = jwt.sign(
      { id: admin._id, role: 'admin', email: admin.email, isSuperAdmin: admin.isSuperAdmin || false },
      secret,
      { expiresIn: '30d' }
    );

    res.json({
      _id: admin._id,
      name: admin.name || payload.name,
      email: admin.email,
      role: 'admin',
      isSuperAdmin: admin.isSuperAdmin || false,
      token
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const admins = await Admin.find({}).lean();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ email, name: name || email.split('@')[0] });
    if (req.io) req.io.emit('admin_added', admin);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'Admin not found' });
    if (target.isSuperAdmin) return res.status(403).json({ message: 'Cannot remove super admin' });
    await Admin.findByIdAndDelete(req.params.id);
    if (req.io) req.io.emit('admin_deleted', req.params.id);
    res.json({ message: 'Admin removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
