import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Route to create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    // Fallback to test keys if not in env
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY || process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyIdHere',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourTestKeySecretHere',
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// Route to verify Razorpay Payment
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'YourTestKeySecretHere';

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

export default router;
