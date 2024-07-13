import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FileCase = () => {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      setError('Access token not found. Please log in.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/cases/',
        {
          title,
          description,
          due_date: dueDate,
          lawyer: lawyerId,
          client: localStorage.getItem('userId'),
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        navigate('/cases');
      } else {
        setError('Failed to file the case. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to file the case.');
      } else {
        setError('Failed to file the case. Please try again.');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>File Case with Lawyer</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_title" style={{ fontWeight: 'bold' }}>
            Case Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="id_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ borderRadius: '10px' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="id_description" style={{ fontWeight: 'bold' }}>
            Description:
          </label>
          <textarea
            className="form-control"
            id="id_description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
            style={{ borderRadius: '10px' }}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="id_due_date" style={{ fontWeight: 'bold' }}>
            Due Date:
          </label>
          <input
            type="date"
            className="form-control"
            id="id_due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            style={{ borderRadius: '10px' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px' }}>
          File Case
        </button>
      </form>
    </div>
  );
};

export default FileCase;