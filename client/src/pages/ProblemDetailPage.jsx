import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ProblemDetailPage() {
  const { id } = useParams(); // problem ID from URL
  const { user , token } = useSelector((state) => state.auth);


  const [problem, setProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
    setProblem(res.data);

    if (user?.role === 'admin') {
      
      const tcRes = await axios.get(
        `http://localhost:5000/api/testcases/problem/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestcases(Array.isArray(tcRes.data) ? tcRes.data : []);
    }
  } catch (err) {
    console.error(err);
  }
};


    fetchData();
  }, [id, user]);

  const handleAddOrUpdateTestcase = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/testcases/${editingId}`, { input, output }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`http://localhost:5000/api/testcases`, {
          input,
          output,
          problemId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const tcRes = await axios.get(`http://localhost:5000/api/testcases/problem/${id}`,
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestcases(Array.isArray(tcRes.data) ? tcRes.data : []);
      setInput('');
      setOutput('');
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (tcId) => {
    try {
      await axios.delete(`http://localhost:5000/api/testcases/${tcId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      const tcRes = await axios.get(`http://localhost:5000/api/testcases/problem/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setTestcases(Array.isArray(tcRes.data) ? tcRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (tc) => {
    setInput(tc.input);
    setOutput(tc.output);
    setEditingId(tc._id);
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
      <p className="mb-2"><strong>Description:</strong> {problem.description}</p>
      <p className="mb-2"><strong>Input Format:</strong> {problem.inputFormat}</p>
      <p className="mb-2"><strong>Output Format:</strong> {problem.outputFormat}</p>
      <p className="mb-2"><strong>Constraints:</strong> {problem.constraints}</p>
      <p className="mb-2"><strong>Sample Input:</strong> {problem.sampleInput}</p>
      <p className="mb-2"><strong>Sample Output:</strong> {problem.sampleOutput}</p>
      <p className="mb-2"><strong>Difficulty:</strong> {problem.difficulty}</p>
      <p className="mb-2"><strong>Tags:</strong> {problem.tags?.join(', ')}</p>

      {user?.role === 'admin' && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Testcases</h3>

          {testcases.map((tc) => (
            <div key={tc._id} className="border p-2 mb-2 rounded bg-gray-100">
              <p><strong>Input:</strong> {tc.input}</p>
              <p><strong>Output:</strong> {tc.output}</p>
              <button
                onClick={() => handleEdit(tc)}
                className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tc._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">
              {editingId ? 'Edit Testcase' : 'Add New Testcase'}
            </h4>
            <input
              type="text"
              placeholder="Input"
              className="border px-2 py-1 mr-2 mb-2 w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Output"
              className="border px-2 py-1 mr-2 mb-2 w-full"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
            <button
              onClick={handleAddOrUpdateTestcase}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editingId ? 'Update Testcase' : 'Add Testcase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDetailPage;
