import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body; // This is the access_token from frontend
    
    // Fetch user info from Google
    const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const { email, name, sub: googleId } = googleUser;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        googleId,
        email,
        name,
        role: 'admin' // Temporarily making first logins admins or based on logic
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    // Create custom JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret123', 
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwtToken,
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
});

export default router;
