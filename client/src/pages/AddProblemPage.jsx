import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProblemPage = () => {
  const { user,token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  console.log(backendUrl);

  const [form, setForm] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    difficulty: 'Easy',
    tags: '',
  });

  const [testcases, setTestcases] = useState([
    { input: '', output: '' },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (index, e) => {
    const updated = [...testcases];
    updated[index][e.target.name] = e.target.value;
    setTestcases(updated);
  };

  const addTestcase = () => {
    setTestcases([...testcases, { input: '', output: '' }]);
  };

  const removeTestcase = (index) => {
    const updated = [...testcases];
    updated.splice(index, 1);
    setTestcases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()),
        testcases,
      };

      const res = await axios.post(`${backendUrl}/api/problems`
        ,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/problems/${res.data._id}`);
    } catch (err) {
      console.error('Error creating problem:', err.response?.data || err.message);
      alert('Failed to create problem');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Problem Fields */}
        {[
          { label: 'Title', name: 'title' },
          { label: 'Description', name: 'description', type: 'textarea' },
          { label: 'Input Format', name: 'inputFormat', type: 'textarea' },
          { label: 'Output Format', name: 'outputFormat', type: 'textarea' },
          { label: 'Constraints', name: 'constraints', type: 'textarea' },
          { label: 'Sample Input', name: 'sampleInput', type: 'textarea' },
          { label: 'Sample Output', name: 'sampleOutput', type: 'textarea' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-semibold">{label}</label>
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            )}
          </div>
        ))}

        {/* Difficulty */}
        <div>
          <label className="block font-semibold">Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold">Tags (comma-separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., array, dp, sorting"
          />
        </div>

        {/* Testcases */}
        <div>
          <label className="block font-bold">Testcases</label>
          {testcases.map((tc, idx) => (
            <div key={idx} className="mb-4 border p-2 rounded bg-gray-50">
              <label className="block font-medium">Input</label>
              <textarea
                name="input"
                value={tc.input}
                onChange={(e) => handleTestcaseChange(idx, e)}
                className="w-full border p-2 mb-2"
              />
              <label className="block font-medium">Output</label>
              <textarea
                name="output"
                value={tc.output}
                onChange={(e) => handleTestcaseChange(idx, e)}
                className="w-full border p-2 mb-2"
              />
              {testcases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcase(idx)}
                  className="text-red-600 text-sm"
                >
                  Delete Testcase
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTestcase}
            className="text-blue-600 mt-2"
          >
            + Add Another Testcase
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblemPage;
