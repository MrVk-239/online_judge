// routes/testcaseRoutes.js
import express from 'express';
import {
  addTestcase,
  getTestcasesByProblem,
  updateTestcase,
  deleteTestcase,
} from '../controllers/testcaseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, addTestcase);
router.get('/:problemId', protect, isAdmin, getTestcasesByProblem);
router.put('/:id', protect, isAdmin, updateTestcase); // Edit
router.delete('/:id', protect, isAdmin, deleteTestcase); // Delete

export default router;
