import Submission from '../models/Submission.js';

export const saveSubmission = async (req, res) => {
  try {
    const { problemId, language, code, passed } = req.body;
    const submission = new Submission({
      userId: req.user._id,
      problemId,
      language,
      code,
      passed,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;

    const submissions = await Submission.find({ userId: userId, problemId: problemId }).populate('problemId', 'title');
    res.status(200).json(submissions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};



export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('problemId', 'title');

    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    // Replace user with userId
    if (submission.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(submission);
  } catch (err) {
    console.error('Error fetching submission:', err);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
};

export const getAcceptedProblems = async (req, res) => {
  try {
    const accepted = await Submission.find({
      userId: req.user._id,
      passed: true,
    }).distinct('problemId');

    res.status(200).json(accepted); // array of problemIds
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch accepted problems' });
  }
};
