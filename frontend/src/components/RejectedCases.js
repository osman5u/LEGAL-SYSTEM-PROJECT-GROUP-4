import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RejectedCases = () => {
  const [rejectedCases, setRejectedCases] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRejectedCases();
  }, []);

  const fetchRejectedCases = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/rejected-cases/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setRejectedCases(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to fetch rejected cases.');
      } else {
        setError('Failed to fetch rejected cases. Please try again.');
      }
    }
  };

  const moveCaseToPending = async (caseId) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        navigate('/login');
        return;
      }

      await axios.post(`http://localhost:8000/api/move-to-pending/${caseId}/`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchRejectedCases();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to move case to pending.');
      } else {
        setError('Failed to move case to pending. Please try again.');
      }
    }
  };

  const deleteCase = async (caseId) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:8000/api/delete-case/${caseId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchRejectedCases();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to delete case.');
      } else {
        setError('Failed to delete case. Please try again.');
      }
    }
  };

  return (
    <div className="shiny-box-shadow-container">
      <h1 className="text-center shiny-text">Rejected Cases</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rejectedCases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>{caseItem.title}</td>
                <td>{caseItem.description}</td>
                <td>{caseItem.due_date}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => moveCaseToPending(caseItem.id)}
                  >
                    Move to Pending
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCase(caseItem.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedCases;
