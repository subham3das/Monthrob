import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Collection', collectionSchema);
