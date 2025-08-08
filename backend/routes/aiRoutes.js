import express from 'express';
import { aiReview } from '../controllers/aiController.js';

const router = express.Router();

router.post('/review', aiReview); 

export default router;
