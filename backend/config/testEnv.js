import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
console.log('Resolving to:', envPath);
const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
