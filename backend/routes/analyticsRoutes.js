import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import VisitLog from '../models/VisitLog.js';
import Order from '../models/Order.js';

const router = express.Router();

// POST /api/analytics/visit
router.post('/visit', async (req, res) => {
  try {
    const { userId, email } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Check if we logged this IP recently (in the last hour) to prevent spam
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentVisit = await VisitLog.findOne({ ip, createdAt: { $gte: oneHourAgo } });

    // Only log if they haven't visited in the last hour, OR if they just logged in (so their state changed)
    if (!recentVisit || (userId && recentVisit.isGuest)) {
      await VisitLog.create({
        ip,
        user: userId || null,
        email: email || null,
        isGuest: !userId
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({}).lean();
    
    // Calculate Total Revenue
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    // Calculate This Month Revenue
    const thisMonthOrders = orders.filter(o => new Date(o.createdAt) >= startOfMonth);
    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Get Active Orders (Placed, Processing, Shipped)
    const activeOrders = orders.filter(o => ['Placed', 'Processing', 'Shipped'].includes(o.status)).length;
    
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Get Recent Visitors
    const visitors = await VisitLog.find({}).sort({ createdAt: -1 }).limit(100).lean();

    res.json({
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        average: averageOrderValue,
      },
      orders: {
        total: orders.length,
        active: activeOrders,
      },
      visitors
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
