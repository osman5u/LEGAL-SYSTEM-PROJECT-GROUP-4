import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './FileCaseView.css';

const FileCase = () => {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [client, setClient] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      setError('Access token not found. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const caseResponse = await axios.post(
        'http://localhost:8000/api/cases/',
        {
          title,
          description,
          due_date: dueDate,
          lawyer: lawyerId,
          client: client,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (caseResponse.status === 201) {
        // Create a new notification
        await axios.post(
          'http://localhost:8000/api/notifications/',
          {
            case: caseResponse.data.id,
            message: `A new case "${title}" has been filed.`,
            recipient: lawyerId,
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        navigate('/caseHistory');
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
    <div className="shiny-box-shadow-container">
      <h1 className="form-title">File Case with Lawyer</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_title">Case Name:</label>
          <input
            type="text"
            className="form-control"
            id="id_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="id_description">Description:</label>
          <textarea
            className="form-control"
            id="id_description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="id_due_date">Due Date:</label>
          <input
            type="date"
            className="form-control"
            id="id_due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          File Case
        </button>
      </form>
    </div>
  );
};

export default FileCase;