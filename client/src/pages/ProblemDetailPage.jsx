import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from "react-markdown";


const prismLanguageMap = {
  c: languages.c,
  cpp: languages.cpp,
  java: languages.java,
  python: languages.python,
};

function ProblemDetailPage() {
  const { id } = useParams(); // problem ID from URL
  const { user, token } = useSelector((state) => state.auth);
  const [problem, setProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);


  const navigate = useNavigate();


  const handleAIReview = async () => {
    try {
      setLoadingAI(true);
      setAiResponse("");

      // Prepare the payload
      const payload = {
        problemTitle: problem.title,
        problemDescription: problem.description,
        code: code,              // user's code from editor
        input: input,      // user's custom input if any
        output: output,          // output from run
      };

      const token = localStorage.getItem("token");

      // Send request to backend AI review route
      const { data } = await axios.post(
        "http://localhost:5000/api/ai/review",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAiResponse(data.aiResponse); // assuming backend returns { message: "...ai feedback..." }
    } catch (error) {
      console.error("AI Review error:", error);
      setAiResponse("Error fetching AI review.");
    } finally {
      setLoadingAI(false);
    }
  };




  useEffect(() => {
    const templates = {
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  \n  return 0;\n}`,
      c: `#include <stdio.h>\nint main() {\n  \n  return 0;\n}`,
      java: `public class Main {\n  public static void main(String[] args) {\n    \n  }\n}`,
      python: `# your code here`,
    };
    setCode(templates[language] || '');
  }, [language]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(res.data);
        const tcRes = await axios.get(
          `http://localhost:5000/api/testcases/problem/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTestcases(Array.isArray(tcRes.data) ? tcRes.data : []);
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
    const confirmed = window.confirm('Are you sure you want to delete this testcase?');
    if (!confirmed) return;

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

  const runCode = async () => {
    try {
      const res = await axios.post('http://localhost:8000/run', {
        language,
        code,
        input,
      });

      const userOutput = res.data.output.trim();
      setOutput(userOutput);
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  };

  const submitCode = async () => {
    try {
      const results = await Promise.all(
        testcases.map(async (tc, index) => {
          const res = await axios.post('http://localhost:8000/run', {
            language,
            code,
            input: tc.input,
          });

          const userOutput = res.data.output.trim();
          const expectedOutput = tc.output.trim();

          return {
            passed: userOutput === expectedOutput,
            index: index + 1,
            input: tc.input,
            expected: expectedOutput,
            actual: userOutput,
          };
        })
      );

      const allPassed = results.every((r) => r.passed);
      await axios.post('http://localhost:5000/api/submissions', {
        problemId: id,
        language,
        code,
        passed: allPassed,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (allPassed) {
        setOutput("Code Accepted ✅");
      } else {
        const failed = results.find((r) => !r.passed);
        setOutput(
          `Wrong Answer ❌\n\nFailed Testcase #${failed.index}\nInput:\n${failed.input}\nExpected:\n${failed.expected}\nGot:\n${failed.actual}`
        );
      }
    } catch (err) {
      setOutput('Compilation Error');
    }
  };


  if (!problem) return <div>Loading...</div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center text-gray-800">{problem.title}</h2>

      <div className="space-y-2 text-gray-700 text-sm">
        <p><strong>Description:</strong> {problem.description}</p>
        <p><strong>Input Format:</strong> {problem.inputFormat}</p>
        <p><strong>Output Format:</strong> {problem.outputFormat}</p>
        <p><strong>Constraints:</strong> {problem.constraints}</p>
        <p><strong>Sample Input:</strong> {problem.sampleInput}</p>
        <p><strong>Sample Output:</strong> {problem.sampleOutput}</p>
        <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        <p><strong>Tags:</strong> {problem.tags?.join(', ')}</p>
      </div>

      {/* Admin Testcases */}
      {user?.role === 'admin' && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Testcases</h3>

          {testcases.map((tc) => (
            <div key={tc._id} className="border border-gray-200 p-3 rounded-md bg-gray-50 text-sm">
              <p><strong>Input:</strong> {tc.input}</p>
              <p><strong>Output:</strong> {tc.output}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(tc)}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tc._id)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              {editingId ? 'Edit Testcase' : 'Add New Testcase'}
            </h4>
            <input
              type="text"
              placeholder="Input"
              className="border px-2 py-1 w-full text-sm rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Output"
              className="border px-2 py-1 w-full text-sm rounded"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
            <button
              onClick={handleAddOrUpdateTestcase}
              className="bg-green-600 text-white text-sm px-4 py-1.5 rounded"
            >
              {editingId ? 'Update Testcase' : 'Add Testcase'}
            </button>
          </div>
        </div>
      )}

      {/* View Submissions */}
      <div className="text-right">
        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
          onClick={() => navigate(`/submissions/${id}`)}
        >
          View All Submissions
        </button>
      </div>

      {/* Language Selector */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-3 py-2 rounded w-full text-sm"
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      {/* Code Editor */}
      <div>
        <label className="block text-sm font-medium mb-1">Your Code:</label>
        <Editor
          value={code}
          onValueChange={(newCode) => setCode(newCode)}
          highlight={(code) => highlight(code, prismLanguageMap[language], language)}
          padding={10}
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 14,
            minHeight: '200px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '6px',
          }}
        />
      </div>

      {/* Custom Input */}
      <div>
        <label className="block text-sm font-medium mb-1">Custom Input:</label>
        <textarea
          className="border rounded p-2 w-full text-sm"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={runCode}
          className="bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-600"
        >
          Run (Custom Input)
        </button>

        {testcases.length > 0 && (
          <button
            onClick={submitCode}
            className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
          >
            Submit (Check All Testcases)
          </button>
        )}
      </div>

      {/* Output Box */}
      <div>
        <label className="block text-sm font-medium mb-1">Output:</label>
        <div
          className={`border rounded p-2 w-full text-sm bg-gray-100 whitespace-pre-wrap ${'text-gray-800'
            }`}
        >
          {output}
        </div>

        {aiResponse && (
          <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">AI Feedback</h3>
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        )}

        <button
          onClick={handleAIReview}
          disabled={loadingAI}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loadingAI ? "Reviewing..." : "AI Review"}
        </button>
      </div>
    </div>
  );

}

export default ProblemDetailPage;
