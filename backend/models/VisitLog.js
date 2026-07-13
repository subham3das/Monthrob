import mongoose from 'mongoose';

const visitLogSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  isGuest: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('VisitLog', visitLogSchema);
