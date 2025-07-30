import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/themes/prism.css';
import axios from 'axios';
import './App.css';

function App() {
  // State to manage user's C++ code, input, output, and loading status
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    int num1, num2, sum;
    cin >> num1 >> num2;
    sum = num1 + num2;
    cout << "The sum of the two numbers is: " << sum;
    return 0;
}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to send code to backend for compilation and execution
  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setOutput('');

    const payload = {
      language: 'cpp',
      code,
      input,
    };

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(backendUrl, payload);
      setOutput(data.output);
    } catch (error) {
      // Handle different types of errors and show user-friendly messages
      if (error.response) {
        setOutput(`Error: ${error.response.data.error || 'Server error occurred'}`);
      } else if (error.request) {
        setOutput('Error: Could not connect to server.');
      } else {
        setOutput(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
return (
  <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-6 lg:px-20 font-sans">
    <h1 className="text-4xl font-bold text-center mb-10 text-indigo-600">
      ⚙️ C++ Online Compiler
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[550px]">
      {/* Left: Code Editor + Run */}
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-col">
        <div className="text-lg font-semibold text-gray-700 mb-2">
          ✍️ Code Editor
        </div>

        {/* Editor fills most of the space */}
        <div className="flex-1 overflow-hidden border border-gray-200 rounded-md bg-gray-50">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, languages.cpp || languages.clike)}
            padding={12}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              height: '100%',
              backgroundColor: '#f9fafb',
            }}
          />
        </div>

        {/* Run Button below */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition ${
            isLoading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.6 3.11a.375.375 0 0 1-.56-.327V8.887c0-.285.308-.465.56-.326l5.6 3.11z"
            />
          </svg>
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Right: Input + Output */}
      <div className="flex flex-col gap-4">
        {/* Input */}
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col flex-1">
          <div className="text-md font-semibold text-gray-700 mb-2">
            🧾 Program Input
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 resize-none p-3 border border-gray-300 rounded-md text-sm bg-gray-50"
            placeholder="Enter input (optional)"
          />
        </div>

        {/* Output */}
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col flex-1">
          <div className="text-md font-semibold text-gray-700 mb-2">
            🖥️ Output
          </div>
          <div className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-md overflow-y-auto font-mono text-sm">
            {output ? output : 'Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  </div>
);


}

export default App;