import Testcase from '../models/Testcase.js';

export const getTestcasesByProblem = async (req, res) => {
  try {
    const testcases = await Testcase.find({ problemId: req.params.problemId });
    res.json(testcases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get testcases', error: err.message });
  }
};

export const createTestcase = async (req, res) => {
  try {
    const { input, output, problemId } = req.body;
    const newTc = new Testcase({ input, output, problemId });
    await newTc.save();
    res.status(201).json(newTc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create testcase', error: err.message });
  }
};

export const updateTestcase = async (req, res) => {
  try {
    const updated = await Testcase.findByIdAndUpdate(
      req.params.id,
      { input: req.body.input, output: req.body.output },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update testcase', error: err.message });
  }
};

export const deleteTestcase = async (req, res) => {
  try {
    await Testcase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testcase deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete testcase', error: err.message });
  }
};
