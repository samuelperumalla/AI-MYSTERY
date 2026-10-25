import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI is required. Copy server/.env.example to server/.env and configure a MongoDB connection string.');
  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://. Check server/.env; see server/.env.example for the local MongoDB format.');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.info('MongoDB connected');
}
