import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }

  try {
    const admin = await Admin.findById(req.user.id).lean();
    if (!admin) {
      return res.status(403).json({ message: 'Access denied, admin account no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
