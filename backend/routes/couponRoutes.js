import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// List all
router.get('/', async (req, res) => {
  try {
    res.json(await Coupon.find({}).lean());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, code: req.body.code?.toUpperCase() });
    res.status(201).json(coupon);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Apply/validate — called by checkout frontend
router.post('/apply', async (req, res) => {
  try {
    const { code, userId, orderAmount } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'Coupon is inactive' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.usageCount >= coupon.maxUsers)
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrderAmount)
      return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrderAmount}` });

    // Per-user check
    if (userId) {
      const userUsage = coupon.usedBy.filter(id => id.toString() === userId).length;
      if (userUsage >= coupon.limitPerUser)
        return res.status(400).json({ message: 'You have already used this coupon' });
    }

    const discount = coupon.type === 'percentage'
      ? Math.round(orderAmount * coupon.value / 100)
      : Math.min(coupon.value, orderAmount);

    res.json({ discount, couponId: coupon._id, type: coupon.type, value: coupon.value });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Mark coupon as used (called after successful order)
router.post('/use', async (req, res) => {
  try {
    const { couponId, userId } = req.body;
    await Coupon.findByIdAndUpdate(couponId, {
      $inc: { usageCount: 1 },
      ...(userId ? { $push: { usedBy: userId } } : {})
    });
    res.json({ message: 'ok' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
