import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (req.file && req.file.path) {
    res.json({ url: req.file.path });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
});

export default router;
