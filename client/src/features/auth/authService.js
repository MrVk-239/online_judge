// src/features/auth/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const register = async (userData) => {
  const res = await axios.post(API_URL + 'register', userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await axios.post(API_URL + 'login', userData);
  return res.data;
};

export const authService = {
  register,
  login,
};
