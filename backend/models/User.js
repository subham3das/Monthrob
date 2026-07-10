import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, sparse: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  phone: { type: String, sparse: true, unique: true },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
