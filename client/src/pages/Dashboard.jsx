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

  const goToProblems = () => {
    navigate("/problems");
  };

  const goToAddProblem = () => {
    navigate("/add-problem");
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        👋 Welcome, {user?.username || "User"}!
      </h1>
      <p className="mb-4">You are now inside the dashboard.</p>

      <div className="flex flex-col space-y-4">
        <button
          onClick={goToProblems}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Problems
        </button>

        {user?.role === "admin" && (
          <button
            onClick={goToAddProblem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Problem
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
