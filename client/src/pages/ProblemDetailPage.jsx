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

const prismLanguageMap = {
  c: languages.c,
  cpp: languages.cpp,
  java: languages.java,
  python: languages.python,
};

function ProblemDetailPage() {
  const { id } = useParams(); // problem ID from URL
  const { user , token } = useSelector((state) => state.auth);


  const [problem, setProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
    setProblem(res.data);

    // if (user?.role === 'admin') {
      
      const tcRes = await axios.get(
        `http://localhost:5000/api/testcases/problem/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestcases(Array.isArray(tcRes.data) ? tcRes.data : []);
    // }
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

    if (allPassed) {
      setOutput("Code Accepted ✅");
    } else {
      const failed = results.find((r) => !r.passed);
      setOutput(
        `Wrong Answer ❌\n\nFailed Testcase #${failed.index}\nInput:\n${failed.input}\nExpected:\n${failed.expected}\nGot:\n${failed.actual}`
      );
    }
  } catch (err) {
    setOutput('Error: ' + err.message);
  }
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
        {/* Language Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      
      {/* Code Editor */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Your Code:</label>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => highlight(code, prismLanguageMap[language] || languages.cpp)}
          padding={10}
          className="border rounded bg-gray-100 font-mono min-h-[200px]"
        />
      </div>

        {/* Input Box */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Custom Input:</label>
        <textarea
          className="border rounded p-2 w-full"
          rows="4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

       {/* Run Button */}
      <div className="mb-4 flex gap-4">
  <button
    onClick={runCode}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Run (Custom Input)
  </button>

  {testcases.length > 0 && (
    <button
      onClick={submitCode}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Submit (Check All Testcases)
    </button>
  )}
</div>


       {/* Output Box */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Output:</label>
        <textarea
          className="border rounded p-2 w-full bg-gray-100"
          rows="4"
          value={output}
          readOnly
        />
      </div>

    </div>
  );
}

export default ProblemDetailPage;
