import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  linkType: { type: String, enum: ['None', 'Product', 'Collection'], default: 'None' },
  linkedProductId: { type: String },
  linkedCollectionName: { type: String },
  platform: { type: String, enum: ['All', 'Desktop', 'Mobile'], default: 'All' }
});

const showcaseSchema = new mongoose.Schema({
  mainHeadline: { type: String, default: '' },
  subHeadline: { type: String, default: '' },
  slides: [slideSchema]
}, { timestamps: true });

export default mongoose.model('Showcase', showcaseSchema);
