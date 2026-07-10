import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  shortId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    priceAtTime: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' },
  trackingLink: { type: String, default: '' },
  shippingAddress: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  donation: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.shortId) {
    this.shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ shortId: 1 });

export default mongoose.model('Order', orderSchema);
