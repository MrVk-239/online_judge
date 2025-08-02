// routes/testcase.js
import express from 'express';
import {
  getTestcasesByProblem,
  createTestcase,
  updateTestcase,
  deleteTestcase,
} from '../controllers/testcaseController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/problem/:problemId', protect, getTestcasesByProblem);
router.post('/', protect, isAdmin, createTestcase);
router.put('/:id', protect, isAdmin, updateTestcase);
router.delete('/:id', protect, isAdmin, deleteTestcase);

export default router;
