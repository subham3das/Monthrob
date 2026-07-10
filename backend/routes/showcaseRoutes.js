import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import Showcase from '../models/Showcase.js';

const router = express.Router();

// Get the showcase singleton
router.get('/', async (req, res) => {
  try {
    const showcase = await Showcase.findOne({}).lean();
    res.json(showcase || { mainHeadline: '', subHeadline: '', slides: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update or create the showcase singleton
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    let showcase = await Showcase.findOne({});
    if (showcase) {
      showcase.mainHeadline = req.body.mainHeadline;
      showcase.subHeadline = req.body.subHeadline;
      showcase.slides = req.body.slides;
      const updatedShowcase = await showcase.save();
      if (req.io) req.io.emit('showcase_updated', updatedShowcase);
      res.json(updatedShowcase);
    } else {
      showcase = new Showcase(req.body);
      const createdShowcase = await showcase.save();
      if (req.io) req.io.emit('showcase_updated', createdShowcase);
      res.status(201).json(createdShowcase);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
