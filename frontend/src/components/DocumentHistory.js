import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './DocumentHistory.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DocumentHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [updatedFile, setUpdatedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      const response = await axios.get('http://localhost:8000/api/documenthistory/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleUpdateDocument = (document) => {
    setSelectedDocument(document);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      const formData = new FormData();
      formData.append('file', updatedFile);

      await axios.patch(`http://localhost:8000/api/documentupdatedelete/${selectedDocument.id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowUpdateModal(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleDeleteDocument = (document) => {
    setSelectedDocument(document);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/api/documentupdatedelete/${selectedDocument.id}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      setShowDeleteModal(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

 const getFileIcon = (fileName) => {
  const fileExtension = fileName.split('.').pop().toLowerCase();
  switch (fileExtension) {
    case 'pdf':
      return <i className="fas fa-file-pdf file-icon"></i>;
    case 'docx':
    case 'doc':
      return <i className="fas fa-file-word file-icon"></i>;
    case 'xls':
    case 'xlsx':
      return <i className="fas fa-file-excel file-icon"></i>;
    case 'ppt':
    case 'pptx':
      return <i className="fas fa-file-powerpoint file-icon"></i>;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <i className="fas fa-file-image file-icon"></i>;
    default:
      return <span className="file-name">{fileName}</span>;
  }
};

  return (
    <div className="container-fluid document-history-container">
      <h1 className="section-title">Document Sent History</h1>
      <div className="table-responsive">
        <table className="table table-hover table-bordered table-striped documents-table">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>File Image</th>
              <th>Uploaded At</th>
              <th>Case</th>
              <th>Lawyer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="table-row zoom-effect animated-item">
                <td>{document.id}</td>
                <td>
                  <a href={document.file} target="_blank" rel="noopener noreferrer" className="text-decoration-none" title={document.file}>
                    {getFileIcon(document.file)}
                  </a>
                </td>
                <td>{document.uploaded_at}</td>
                <td>{document.case.title}</td>
                <td>{document.lawyer.username}</td>
                <td className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    className="btn-sm update-button mr-2"
                    onClick={() => handleUpdateDocument(document)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-sm delete-button"
                    onClick={() => handleDeleteDocument(document)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile">
            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setUpdatedFile(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this document?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DocumentHistory;
