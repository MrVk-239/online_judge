import express from 'express';
import { aiReview } from '../controllers/aiController.js';

const router = express.Router();

router.post('/review', aiReview); // POST /api/ai/review

export default router;
