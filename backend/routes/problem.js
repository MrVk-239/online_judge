// backend/routes/problem.js
import express from 'express';
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, createProblem); // Create
router.get('/', getAllProblems);         // Read all
router.get('/:id', getProblemById);      // Read one
router.put('/:id', protect,isAdmin, updateProblem); // Update
router.delete('/:id', protect,isAdmin, deleteProblem); // Delete

export default router;
