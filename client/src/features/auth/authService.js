// src/features/auth/authService.js
import axios from 'axios';
const backendURL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendURL}/api/auth/`;

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
