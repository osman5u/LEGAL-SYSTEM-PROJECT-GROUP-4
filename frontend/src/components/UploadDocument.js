import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UploadDocument.css';

const UploadDocument = () => {
  const [pendingCases, setPendingCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        setError('Access token not found. Please log in.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/casespending/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const pendingCases = response.data.filter((caseItem) => caseItem.status === 'pending');
        setPendingCases(pendingCases);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.detail || 'Failed to fetch data.');
        } else {
          setError('Failed to fetch data. Please try again.');
        }
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      setError('Access token not found. Please log in.');
      return;
    }

    if (!selectedCase || !documentFile) {
      setError('Please select a case and a file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('case', selectedCase);
      formData.append('file', documentFile);

      await axios.post('http://localhost:8000/api/documents/', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Create a notification for the lawyer
      const selectedPendingCase = pendingCases.find((caseItem) => caseItem.id === selectedCase);
      await axios.post(
        'http://localhost:8000/api/notifications/',
        {
          case: selectedCase,
          message: 'A new document has been uploaded for the case.',
          recipient: selectedPendingCase.lawyer.id,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Upload error:', error); // Log the error for debugging
    } finally {
      navigate('/documentHistory'); // Always navigate to caseHistory after submit
    }
  };

  return (
    <div className="shiny-box-shadow-container">
      <h1 className="form-title">Upload Document</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="case">Case:</label>
          <select
            className="form-control"
            id="case"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            required
          >
            <option value="">Select a case</option>
            {pendingCases.map((caseItem) => (
              <option key={caseItem.id} value={caseItem.id}>
                {caseItem.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="file">File:</label>
          <input
            type="file"
            className="form-control-file"
            id="file"
            onChange={(e) => setDocumentFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;