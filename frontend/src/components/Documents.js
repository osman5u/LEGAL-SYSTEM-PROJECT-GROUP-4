import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Modal, Button, Form } from 'react-bootstrap';

const UploadedDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [formData, setFormData] = useState({
    case_title: '',
    client: '',
    document: '',
    uploaded_date: '',
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/uploadeddoc/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDocuments(response.data);
      } catch (err) {
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8000${fileUrl}`;
    link.download = fileUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowModal = (document) => {
    setCurrentDocument(document);
    setFormData({
      case_title: document.case_title,
      client: document.client,
      document: document.document,
      uploaded_date: moment(document.uploaded_date).format('YYYY-MM-DD'),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDocument(null);
  };

  const renderFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={`http://localhost:8000${fileName}`}
            alt="file"
            title={fileName}
            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
          />
        );
      case 'pdf':
        return <i className="fas fa-file-pdf fa-2x" style={{ color: 'red' }} title={fileName}></i>;
      case 'doc':
      case 'docx':
        return <i className="fas fa-file-word fa-2x" style={{ color: 'blue' }} title={fileName}></i>;
      case 'xls':
      case 'xlsx':
        return <i className="fas fa-file-excel fa-2x" style={{ color: 'green' }} title={fileName}></i>;
      default:
        return <i className="fas fa-file fa-2x" style={{ color: 'gray' }} title={fileName}></i>;
    }
  };

  return (
    <div className="container-fluid document-history-container">
      <h1 className="section-title">Uploaded Documents</h1>
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <p className="no-notifications">{error}</p>
      ) : (
        <div className="table-responsive w-100">
          <table className="table table-hover table-bordered table-striped">
            <thead style={{ backgroundColor: '#28ce03', color: '#fff' }}>
              <tr>
                <th>ID</th>
                <th>Case Title</th>
                <th>Client</th>
                <th>Document</th>
                <th>Uploaded Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No documents found</td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id} className="zoom-effect animated-item">
                    <td>{document.id}</td>
                    <td>{document.case_title}</td>
                    <td>{document.client}</td>
                    <td
                      onClick={() => handleDownload(document.file)}
                      title={`http://localhost:8000${document.file}`}
                    >
                      {renderFileIcon(document.file)}
                    </td>
                    <td>{moment(document.uploaded_date).format('YYYY-MM-DD')}</td>
                    <td className="d-flex justify-content-center">
                      <button
                        onClick={() => handleDownload(document.file)}
                        className="btn btn-primary btn-sm mr-2 download-button"
                        style={{ backgroundColor: '#28ce03', borderColor: '#28ce03' }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadedDocument;
