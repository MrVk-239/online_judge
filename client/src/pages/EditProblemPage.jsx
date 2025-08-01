import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  fetchTestcases,
  updateTestcase,
  deleteTestcase,
  addTestcase,
} from '../features/problem/testcaseService';

const EditProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    sampleInput: '',
    sampleOutput: '',
    constraints: '',
    difficulty: '',
    tags: '',
  });

  const [testcases, setTestcases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
        const problem = res.data;

        setFormData({
          title: problem.title,
          description: problem.description,
          inputFormat: problem.inputFormat,
          outputFormat: problem.outputFormat,
          sampleInput: problem.sampleInput,
          sampleOutput: problem.sampleOutput,
          constraints: problem.constraints || '',
          difficulty: problem.difficulty,
          tags: problem.tags.join(', '),
        });

        if (user?.isAdmin) {
          const tcData = await fetchTestcases(id, token);
          setTestcases(tcData);
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching data.");
      }
    };

    fetchData();
  }, [id, user, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (index, field, value) => {
    const updated = [...testcases];
    updated[index][field] = value;
    setTestcases(updated);
  };

  const handleUpdateTestcase = async (index) => {
    const tc = testcases[index];
    try {
      await updateTestcase(tc._id, tc, token);
      alert('Testcase updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating testcase');
    }
  };

  const handleDeleteTestcase = async (index) => {
    const tc = testcases[index];
    if (!window.confirm('Are you sure you want to delete this testcase?')) return;

    try {
      await deleteTestcase(tc._id, token);
      setTestcases((prev) => prev.filter((_, i) => i !== index));
      alert('Deleted!');
    } catch (err) {
      console.error(err);
      alert('Error deleting testcase');
    }
  };

  const handleAddTestcase = async () => {
    const newTc = {
      problemId: id,
      input: '',
      output: '',
      isPublic: false,
    };

    try {
      const created = await addTestcase(newTc, token);
      setTestcases((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert('Error adding testcase');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      await axios.put(`http://localhost:5000/api/problems/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Problem updated successfully!');
      navigate(`/problems/${id}`);
    } catch (err) {
      console.error(err);
      alert('Error updating problem.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="text" name="inputFormat" placeholder="Input Format" value={formData.inputFormat} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="text" name="outputFormat" placeholder="Output Format" value={formData.outputFormat} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <textarea name="sampleInput" placeholder="Sample Input" value={formData.sampleInput} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <textarea name="sampleOutput" placeholder="Sample Output" value={formData.sampleOutput} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <textarea name="constraints" placeholder="Constraints (optional)" value={formData.constraints} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Problem</button>
      </form>

      {/* Admin-only Testcase Editor */}
      {user?.isAdmin && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Testcases</h3>
          {testcases.map((tc, idx) => (
            <div key={tc._id} className="border rounded p-4 mb-4 bg-gray-50">
              <textarea
                placeholder="Input"
                value={tc.input}
                onChange={(e) => handleTestcaseChange(idx, 'input', e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <textarea
                placeholder="Output"
                value={tc.output}
                onChange={(e) => handleTestcaseChange(idx, 'output', e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={tc.isPublic}
                  onChange={(e) => handleTestcaseChange(idx, 'isPublic', e.target.checked)}
                />
                <span>Public</span>
              </label>
              <div className="space-x-3">
                <button onClick={() => handleUpdateTestcase(idx)} className="bg-yellow-500 text-white px-3 py-1 rounded">Save</button>
                <button onClick={() => handleDeleteTestcase(idx)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
          <button onClick={handleAddTestcase} className="bg-green-600 text-white px-4 py-2 rounded mt-2">
            + Add Testcase
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProblemPage;
