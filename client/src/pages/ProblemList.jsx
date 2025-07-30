import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ✅ import

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user); // ✅ get user from redux
   const { token } = useSelector((state) => state.auth); // ✅ Get token

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/problems');
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this problem?");
    if (!confirm) return;

    try {
      console.log("User token:", token);
      await axios.delete(`http://localhost:5000/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete problem.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Problems List</h2>
      <ul className="space-y-2">
        {problems.map((problem) => (
          <li
            key={problem._id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <Link
              to={`/problems/${problem._id}`}
              className="text-blue-600 hover:underline"
            >
              {problem.title}
            </Link>

            {/* ✅ Only show if user is the creator */}
            {user?.id === problem.creator && (
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/problems/${problem._id}/edit`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
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
