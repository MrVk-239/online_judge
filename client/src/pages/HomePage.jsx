import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center space-y-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Welcome to Online Judge
        </h1>

        {!user ? (
          <div className="space-y-4">
            <Link
              to="/login"
              className="block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">Hello, {user.username}</p>
            <Link
              to="/dashboard"
              className="block bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
