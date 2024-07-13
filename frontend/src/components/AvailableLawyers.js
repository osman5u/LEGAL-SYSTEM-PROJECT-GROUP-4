import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AvailableLawyers.css';
import { useParams, useNavigate } from 'react-router-dom';

const AvailableLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/lawyers/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setLawyers(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.detail || 'Failed to fetch lawyers!');
        } else {
          setError('Failed to fetch lawyers!');
        }
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-fluid document-history-container">
      <h1 className="section-title">Available Lawyers</h1>
      <div className="row justify-content-center">
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card shadow-sm">
              {lawyer.profile_picture ? (
                <div className="card-img-top rounded-top overflow-hidden position-relative">
                  <img src={lawyer.profile_picture} className="img-fluid rounded-0" alt={lawyer.full_name} />
                  <div className="zoom-overlay"></div>
                </div>
              ) : (
                <div className="card-img-top bg-light text-center p-5 rounded-top">
                  <img src="/static/default_profile.png" className="img-fluid" alt={lawyer.full_name} />
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{lawyer.full_name}</h5>
                <p className="card-text">Role: {lawyer.role}</p>
                <Link to={`/fileCaseView/${lawyer.id}`} className="btn btn-primary btn-sm">
                  File Case
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableLawyers;