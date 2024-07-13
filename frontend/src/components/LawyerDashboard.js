import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LawyerDashboard = () => {
  const [dashboardCounts, setDashboardCounts] = useState({
    pendingCases: 0,
    approvedCases: 0,
    rejectedCases: 0,
    documents: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/lawyer/dashboard/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setDashboardCounts(response.data);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      }
    };

    fetchDashboardCounts();
  }, []);

  return (
    <div>
      <h1 className="text-center shiny-text">Lawyer Dashboard</h1>
      <div className="row justify-content-center">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-folder-open fa-3x"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title text-center">Pending Cases</h5>
              <p className="card-text text-center">
                <span className="display-4 font-weight-bold text-white">
                  {dashboardCounts.pendingCases}
                </span>
              </p>
              <a
                href="/pending-cases"
                className="btn btn-light btn-block"
              >
                View Pending Cases
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-check-circle fa-3x"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title text-center">Approved Cases</h5>
              <p className="card-text text-center">
                <span className="display-4 font-weight-bold text-white">
                  {dashboardCounts.approvedCases}
                </span>
              </p>
              <a
                href="/approved-cases"
                className="btn btn-light btn-block"
              >
                View Approved Cases
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-times-circle fa-3x"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title text-center">Rejected Cases</h5>
              <p className="card-text text-center">
                <span className="display-4 font-weight-bold text-white">
                  {dashboardCounts.rejectedCases}
                </span>
              </p>
              <a
                href="/lawyer/rejected-cases"
                className="btn btn-light btn-block"
              >
                View Rejected Cases
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-file-alt fa-3x"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title text-center">Documents</h5>
              <p className="card-text text-center">
                <span className="display-4 font-weight-bold text-white">
                  {dashboardCounts.documents}
                </span>
              </p>
              <a
                href="/lawyer/documents"
                className="btn btn-light btn-block"
              >
                View Documents
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;