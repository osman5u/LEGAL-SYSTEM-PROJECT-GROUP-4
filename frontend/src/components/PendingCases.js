import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PendingCases = () => {
  const [pendingCases, setPendingCases] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPendingCases = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/pending-cases/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setPendingCases(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to fetch pending cases.');
      } else {
        setError('Failed to fetch pending cases. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchPendingCases();
  }, []);

  const approveCase = async (caseId) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        navigate('/login');
        return;
      }

      await axios.post(`http://localhost:8000/api/approve-case/${caseId}/`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchPendingCases();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to approve the case.');
      } else {
        setError('Failed to approve the case. Please try again.');
      }
    }
  };

  const rejectCase = async (caseId) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        navigate('/login');
        return;
      }

      await axios.post(`http://localhost:8000/api/reject-case/${caseId}/`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchPendingCases();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to reject the case.');
      } else {
        setError('Failed to reject the case. Please try again.');
      }
    }
  };

  return (
    <div className="shiny-box-shadow-container">
      <h1 className="text-center shiny-text">Pending Cases</h1>
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
            {pendingCases.map((pendingCase) => (
              <tr key={pendingCase.id}>
                <td>{pendingCase.title}</td>
                <td>{pendingCase.description}</td>
                <td>{pendingCase.due_date}</td>

                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => approveCase(pendingCase.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => rejectCase(pendingCase.id)}
                  >
                    Reject
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

export default PendingCases;