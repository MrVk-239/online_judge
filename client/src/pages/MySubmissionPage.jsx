import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


const MySubmissionsPage = () => {
  const { problemId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions', err);
      }
    };
    fetchSubmissions();
  }, [token, problemId]);

  console.log(submissions);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-2">
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
        {submissions.length === 0 ? (
          <p className="text-center text-gray-500">No submissions found.</p>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">All submissions for {submissions[0]?.problemId?.title}</h1>
            <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
              <thead>
                <tr className="bg-blue-100 text-gray-700 uppercase text-xs">
                  <th className="p-2 text-center">ID</th>
                  <th className="p-2 text-center">Language</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, index) => {
                  console.log('createdAt:', s.createdAt);
                  return(
                  <tr
                    key={s?._id}
                    onClick={() => navigate(`/submissionDetail/${s._id}`)}
                    className={`cursor-pointer text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition`}
                  >
                    <td className="p-2 text-indigo-600 font-medium">{s._id}</td>
                    <td className="p-2 text-gray-700 font-medium">{s.language}</td>
                    <td className={`p-2 font-semibold ${s.passed ? 'text-green-600' : 'text-red-500'}`}>
                      {s.passed ? 'Accepted' : 'Wrong Answer'}
                    </td>
                    <td className="p-3 text-gray-600">
                      {s.createdAt ? new Date(s.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      }) : 'N/A'}
                    </td>

                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissionsPage;
