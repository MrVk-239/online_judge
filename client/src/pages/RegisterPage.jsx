import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/dashboard");
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, dispatch, navigate]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {isError && <p className="text-red-500 mb-2">{message}</p>}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="username"
          value={username}
          placeholder="Username"
          onChange={onChange}
          className="border p-2"
        />
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
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
