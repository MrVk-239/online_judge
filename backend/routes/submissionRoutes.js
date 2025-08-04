import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { saveSubmission } from '../controllers/submissionController.js';
import { getMySubmissions } from '../controllers/submissionController.js';
import { getSubmissionById } from '../controllers/submissionController.js';
import { getAcceptedProblems } from '../controllers/submissionController.js';

const router = express.Router();

// Route to save a submission
router.post('/submissions', protect, saveSubmission);
router.get('/:problemId', protect, getMySubmissions);
router.get('/submissionDetail/:id', protect, getSubmissionById);
router.get('/submissionsAcc/accepted', protect, getAcceptedProblems);


export default router;
