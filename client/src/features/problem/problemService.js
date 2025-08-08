import axios from 'axios';
const backendURL=import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendURL}/api/problems`;

// GET all problems
const getProblems = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const problemService = {
  getProblems,
};
