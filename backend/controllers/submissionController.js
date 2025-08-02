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
