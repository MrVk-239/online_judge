import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problem.js';
import testcaseRoutes from './routes/testcaseRoutes.js';
import morgan from 'morgan';
import submissionRoutes from './routes/submissionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';



dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(morgan("dev"));
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/testcases', testcaseRoutes);
app.use('/api', submissionRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Server is working!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error connecting to DB:', err.message);
    process.exit(1); 
  }
};
startServer();