import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@oj.com' });
  try{
    if (existing) {
    console.log('✅ Admin already exists');
    return process.exit(0);
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    username: 'admin',
    email: 'admin@oj.com',
    password: hashed,
    role: 'admin',
  });

  console.log('✅ Admin user created: admin@oj.com with role admin');
  process.exit(0);
}
  catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
