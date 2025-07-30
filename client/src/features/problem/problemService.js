import axios from 'axios';

const API_URL = 'http://localhost:5000/api/problems';

// GET all problems
const getProblems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const problemService = {
  getProblems,
};
