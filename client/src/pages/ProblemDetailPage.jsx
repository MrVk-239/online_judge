import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProblemDetailPage = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
                setProblem(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProblem();
    }, [id]);

    if (!problem) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
            <p><strong>Description:</strong> {problem.description}</p>
            <p><strong>Input Format:</strong> {problem.inputFormat}</p>
            <p><strong>Output Format:</strong> {problem.outputFormat}</p>
            <p><strong>Sample Input:</strong> {problem.sampleInput}</p>
            <p><strong>Sample Output:</strong> {problem.sampleOutput}</p>
            {problem.constraints && (
                <p><strong>Constraints:</strong> {problem.constraints}</p>
            )}
            <p><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>

        </div>
        
    );
};

export default ProblemDetailPage;
