import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const goToProblems = () => navigate("/problems");
  const goToAddProblem = () => navigate("/add-problem");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-2 text-center text-indigo-700">
          👋 Welcome, {user?.username || "User"}!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          You are now inside the dashboard.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={goToProblems}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            📘 View Problems
          </button>

          {user?.role === "admin" && (
            <button
              onClick={goToAddProblem}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-200"
            >
              ➕ Add New Problem
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
          >
            🔒 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
