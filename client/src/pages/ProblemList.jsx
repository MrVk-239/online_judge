import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [acceptedProblems, setAcceptedProblems] = useState([]);
  const navigate = useNavigate();
  const backendURL=import.meta.env.VITE_BACKEND_URL;
  const user = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/problems`);
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAcceptedProblems = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/submissionsAcc/accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAcceptedProblems(res.data);
      } catch (err) {
        console.error('Failed to fetch accepted problems', err);
      }
    };

    fetchProblems();
    if (token) fetchAcceptedProblems();
  }, [token]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this problem?");
    if (!confirm) return;

    try {
      await axios.delete(`${backendURL}/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete problem.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📘 Problem List</h2>
      <ul className="space-y-4">
        {problems.map((problem) => (
          <li
            key={problem._id}
            className="flex justify-between items-center border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md transition"
          >
            {/* Left: Title (clickable) */}
            <Link
              to={`/problems/${problem._id}`}
              className="text-blue-700 font-semibold text-lg hover:underline flex-grow"
            >
              {problem.title}
            </Link>

            {/* Middle: ✅ Solved (if accepted) */}
            {acceptedProblems.includes(problem._id) && (
              <span className="text-green-600 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full ml-4">
                ✅ Solved
              </span>
            )}

            {/* Right: Admin controls */}
            {user?.id === problem.creator && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => navigate(`/problems/${problem._id}/edit`)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </li>

        ))}
      </ul>
    </div>
  );
};

export default ProblemsPage;
