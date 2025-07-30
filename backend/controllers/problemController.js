// backend/controllers/problemController.js
import Problem from '../models/problem.js';

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

// CREATE (Admin only)
export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      constraints,
      difficulty,
      tags
    } = req.body;

    if (!title || !description || !inputFormat || !outputFormat || !sampleInput || !sampleOutput) {
      return res.status(400).json({ msg: 'All required fields must be provided' });
    }

    const newProblem = new Problem({
      title,
      description,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      constraints,
      difficulty,
      tags,
      creator: req.user._id, // Track the creator (admin)
    });

    const saved = await newProblem.save();
    return res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ msg: err.message });
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