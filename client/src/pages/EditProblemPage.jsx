import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditProblemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user); 
     const { token } = useSelector((state) => state.auth); // ✅ Get token

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
    useEffect(() => {
        const fetchProblem = async () => {
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
            } catch (err) {
                console.error(err);
                alert("Error fetching problem.");
            }
        };

        fetchProblem();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            ...formData,
            tags: formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
        };

        try {
            await axios.put(
                `http://localhost:5000/api/problems/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  
                    },
                }
            );
            alert("Problem updated successfully!");
            navigate(`/problems/${id}`);
        } catch (err) {
            console.error(err);
            alert("Error updating problem.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Edit Problem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="inputFormat"
                    placeholder="Input Format"
                    value={formData.inputFormat}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="outputFormat"
                    placeholder="Output Format"
                    value={formData.outputFormat}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <textarea
                    name="sampleInput"
                    placeholder="Sample Input"
                    value={formData.sampleInput}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <textarea
                    name="sampleOutput"
                    placeholder="Sample Output"
                    value={formData.sampleOutput}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <textarea
                    name="constraints"
                    placeholder="Constraints (optional)"
                    value={formData.constraints}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Update Problem
                </button>
            </form>
        </div>
    );
};

export default EditProblemPage;
