// backend/controllers/problemController.js
import Problem from '../models/problem.js';
import Testcase from '../models/Testcase.js';

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ msg: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const createProblem = async (req, res) => {
  try {
    const {
      title, description, inputFormat, outputFormat,
      sampleInput, sampleOutput, constraints, difficulty,
      tags, testcases = []
    } = req.body;
    console.log(req.user)

    const problem = new Problem({
      title,
      description,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      constraints,
      difficulty,
      tags,
      creator: req.user.id, 
    });

    await problem.save();

    // Save testcases if provided
    if (testcases.length > 0) {
      const testcaseDocs = testcases.map(tc => ({
        input: tc.input,
        output: tc.output,
        problemId: problem._id
      }));
      await Testcase.insertMany(testcaseDocs);
    }

    res.status(201).json(problem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating problem', error:err });
  }
};

// UPDATE (Only creator can update)
export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ msg: 'Problem not found' });

    if (problem.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to update this problem' });
    }

    Object.assign(problem, req.body);
    const updated = await problem.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// DELETE (Only creator can delete)
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ msg: 'Problem not found' });

    if (problem.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to delete this problem' });
    }

    await problem.deleteOne();
    res.json({ msg: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};