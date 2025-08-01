// src/features/problem/testcaseService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/testcases';

export const fetchTestcases = async (problemId, token) => {
  const res = await axios.get(`${BASE_URL}/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateTestcase = async (tcId, data, token) => {
  const res = await axios.put(`${BASE_URL}/${tcId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTestcase = async (tcId, token) => {
  const res = await axios.delete(`${BASE_URL}/${tcId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTestcase = async (data, token) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
