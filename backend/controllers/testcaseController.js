// controllers/testcaseController.js
import Testcase from '../models/Testcase.js';

// @desc    Add a new testcase (Admin only)
// controllers/testcaseController.js

export const addTestcase = async (req, res) => {
  const { problemId, input, output, isSample } = req.body;

  if (!problemId || !input || !output) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // ✅ Only check for duplicate input per problem
    const existing = await Testcase.findOne({ problemId, input });
    if (existing) {
      return res.status(409).json({ message: 'Duplicate input for this problem' });
    }

    const testcase = await Testcase.create({
      problemId,
      input,
      output,
      isSample: isSample || false,
    });

    res.status(201).json(testcase);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get testcases for a problem (admin)
export const getTestcasesByProblem = async (req, res) => {
  const { problemId } = req.params;

  try {
    const testcases = await Testcase.find({ problemId });
    res.json(testcases);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update a testcase (Admin only)
export const updateTestcase = async (req, res) => {
  const { id } = req.params;
  const { input, output, isSample } = req.body;

  try {
    const testcase = await Testcase.findById(id);
    if (!testcase) return res.status(404).json({ message: 'Testcase not found' });

    testcase.input = input !== undefined ? input : testcase.input;
    testcase.output = output !== undefined ? output : testcase.output;
    testcase.isSample = isSample !== undefined ? isSample : testcase.isSample;

    const updated = await testcase.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete a testcase (Admin only)
export const deleteTestcase = async (req, res) => {
  const { id } = req.params;

  try {
    const testcase = await Testcase.findById(id);
    if (!testcase) return res.status(404).json({ message: 'Testcase not found' });

    await testcase.deleteOne();
    res.json({ message: 'Testcase deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
