// src/pages/LoginPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

useEffect(() => {
  if (isSuccess || user) {
    navigate("/dashboard");
  }
}, [isSuccess, user, navigate]);

useEffect(() => {
  dispatch(reset());
}, []);


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {isError && <p className="text-red-500 mb-2">{message}</p>}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={onChange}
          className="border p-2"
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={onChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
