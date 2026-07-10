import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  images: [{ type: String }],
  colors: [{ type: String }],
  sizes: [{ type: String }],
  tags: [{ type: String }],
  description: { type: String },
  collectionName: { type: String },
  material: { type: String },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ category: 1, status: 1 });

export default mongoose.model('Product', productSchema);
