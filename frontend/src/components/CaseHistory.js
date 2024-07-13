import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Modal, Button, Form } from 'react-bootstrap';
import './ClientCaseHistory.css';

const ClientCaseHistory = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lawyer: '',
    due_date: '',
    status: '',
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/casesshow/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCases(response.data);
      } catch (err) {
        setError('Failed to fetch cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleDelete = async (caseId) => {
    try {
      const accessToken = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/casesupdate/${caseId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCases(cases.filter(caseItem => caseItem.id !== caseId));
    } catch (err) {
      setError('Failed to delete case');
    }
  };

  const handleShowModal = (caseItem) => {
    setCurrentCase(caseItem);
    setFormData({
      title: caseItem.title,
      description: caseItem.description,
      lawyer: caseItem.lawyer,
      due_date: moment(caseItem.due_date).format('YYYY-MM-DD'),
      status: caseItem.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCase(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access');
      await axios.put(`http://localhost:8000/casesupdate/${currentCase.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCases(cases.map(caseItem => (caseItem.id === currentCase.id ? { ...caseItem, ...formData } : caseItem)));
      handleCloseModal();
    } catch (err) {
      setError('Failed to update case');
    }
  };
  return (
    <div className="container-fluid document-history-container">
      <h1 className="section-title">Client Case History</h1>
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
                <th>Description</th>
                <th>Lawyer</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="zoom-effect animated-item">
                  <td>{caseItem.id}</td>
                  <td>{caseItem.title}</td>
                  <td>{caseItem.description}</td>
                  <td>{caseItem.lawyer.username}</td>
                  <td>{moment(caseItem.due_date).format('YYYY-MM-DD')}</td>
                  <td>{caseItem.status}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      onClick={() => handleShowModal(caseItem)}
                      className="btn btn-primary btn-sm mr-2 update-button"
                      style={{ backgroundColor: '#28ce03', borderColor: '#28ce03' }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(caseItem.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientCaseHistory;