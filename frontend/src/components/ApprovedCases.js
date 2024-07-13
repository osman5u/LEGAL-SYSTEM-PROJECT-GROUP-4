import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ApprovedCases = () => {
  const [approvedCases, setApprovedCases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedCases = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          setError('Access token not found. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/approvedCasesHistory2/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        setApprovedCases(response.data);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.detail || 'Failed to fetch approved cases.');
        } else {
          setError('Failed to fetch approved cases. Please try again.');
        }
      }
    };

    fetchApprovedCases();
  }, []);

    function fetchApprovedCases() {

    }

    const deleteCase = async (caseId) => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        return;
      }

      await axios.delete(`http://localhost:8000/api/approved-cases/${caseId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Refresh the list of approved cases
      fetchApprovedCases();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to delete the case.');
      } else {
        setError('Failed to delete the case. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Approved Cases</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {approvedCases.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="" style={{ backgroundColor: '#28ce03', color: '#fff' }}>
              <tr>
                <th>Case ID</th>
                <th>Case Title</th>
                <th>Client</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td>{caseItem.id}</td>
                  <td>{caseItem.title}</td>
                  <td>{caseItem.client.username}</td>
                  <td>{caseItem.status}</td>
                  <td>
                    <Link to={`/view-case/${caseItem.id}`} className="btn btn-primary btn-sm mr-2">
                      View
                    </Link>
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
      ) : (
        <p>No approved cases found.</p>
      )}
    </div>
  );
};

export default ApprovedCases;
