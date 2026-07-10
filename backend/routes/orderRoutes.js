import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const isCOD = body.paymentMethod?.toLowerCase() === 'cod' || body.paymentMethod?.toLowerCase() === 'cash on delivery';
    if (!isCOD) body.isPaid = true;
    const newOrder = await Order.create(body);
    // Decrement stock for each item
    await Product.bulkWrite(newOrder.items.map(item => ({
      updateOne: { filter: { _id: item.product }, update: { $inc: { stock: -item.quantity } } }
    })));
    const populatedOrder = await Order.findById(newOrder._id).populate('user', 'email name phone').populate('items.product', 'name price images').lean();
    if (req.io) {
      req.io.emit('order_placed', populatedOrder);
    }
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/collective-jar', async (req, res) => {
  try {
    const now = new Date();
    let startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0);
    if (now < startOfPeriod) {
      startOfPeriod.setDate(startOfPeriod.getDate() - 1);
    }

    const orders = await Order.find({
      createdAt: { $gte: startOfPeriod },
      donation: { $exists: true }
    }).lean();

    const totalDonation = orders.reduce((sum, order) => sum + (order.donation || 0), 0);
    const targetGoal = 5000; 
    const percentage = Math.min(100, Math.round((totalDonation / targetGoal) * 100));

    res.json({
      totalDonation,
      targetGoal,
      percentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/myorders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.product', 'name price images').sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'email name phone').populate('items.product', 'name price images').lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, trackingLink } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status || order.status;
      order.trackingLink = trackingLink !== undefined ? trackingLink : order.trackingLink;
      if (status === 'Delivered') order.isPaid = true;
      if (status === 'Cancelled' && order.status !== 'Cancelled') {
        order.isPaid = false;
        // Restore stock
        await Product.bulkWrite(order.items.map(item => ({
          updateOne: { filter: { _id: item.product }, update: { $inc: { stock: item.quantity } } }
        })));
      }
      const updatedOrder = await order.save();
      const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'email name phone').populate('items.product', 'name price images').lean();
      
      if (req.io) {
        req.io.emit('order_updated', populatedOrder);
      }
      
      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.json({ message: 'All orders deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reset-revenue', async (req, res) => {
  try {
    const result = await Order.updateMany({}, { $set: { totalAmount: 0 } });
    res.json({ message: 'All revenue reset to 0', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reset-fund', async (req, res) => {
  try {
    const result = await Order.updateMany({}, { $set: { donation: 0 } });
    res.json({ message: 'Fund reset to 0%', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
