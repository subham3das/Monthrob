import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  googleId: { type: String },
  isSuperAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Admin.findOneAndUpdate(
      { email: 'contactmonthrob@gmail.com' },
      { email: 'contactmonthrob@gmail.com', name: 'Monthrob Admin', isSuperAdmin: true },
      { upsert: true, new: true }
    );
    console.log('Super admin seeded: contactmonthrob@gmail.com');

    const count = await Admin.countDocuments();
    console.log(`Total admins: ${count}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
