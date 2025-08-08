import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

const languageMap = {
  cpp: languages.cpp,
  c: languages.c,
  java: languages.java,
  python: languages.python,
};

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const backendURL=import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSubmission = async () => {
  try {
    const token = localStorage.getItem('token'); // storing the JWT
    const res = await axios.get(`${backendURL}/api/submissionDetail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSubmission(res.data);
  } catch (err) {
    console.error('Error fetching submission', err);
  }
};
    fetchSubmission();
  }, [id]);

if (!submission) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2 text-red-600">Submission not found</h1>
      </div>
    );
  }
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-3xl">
      <h1 className="text-xl font-bold mb-4 text-center">
        Submission for {submission.problemId?.title || 'Unknown Problem'}
      </h1>

      <p className="mb-2 text-center">
        Status:
        <span
          className={`font-semibold ml-2 p-2 ${
            submission?.passed ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {submission?.passed ? 'Accepted' : 'Wrong Answer'}
        </span>
      </p>

      <p className="mb-4 text-center">
        Language: <span className="font-semibold">{submission.language}</span>
      </p>

      <div className="mt-4">
        <Editor
          value={submission.code}
          onValueChange={() => {}}
          highlight={(code) =>
            highlight(code, languageMap[submission.language] || languages.clike)
          }
          padding={10}
          style={{
            backgroundColor: '#f5f5f5',
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: '1px solid #ccc',
            borderRadius: '8px',
            minHeight: '200px',
          }}
          readOnly
        />
      </div>
    </div>
  </div>
);

};

export default SubmissionDetailPage;
