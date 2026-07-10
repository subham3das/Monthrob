import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const userSchema = new mongoose.Schema({
  googleId: { type: String, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  phone: { type: String, sparse: true },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'contactmonthrob@gmail.com' });
    if (existing) {
      existing.role = 'admin';
      existing.name = existing.name || 'Monthrob Admin';
      await existing.save();
      console.log('Updated contactmonthrob@gmail.com to admin role');
    } else {
      await User.create({
        email: 'contactmonthrob@gmail.com',
        name: 'Monthrob Admin',
        role: 'admin'
      });
      console.log('Created admin user: contactmonthrob@gmail.com');
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
