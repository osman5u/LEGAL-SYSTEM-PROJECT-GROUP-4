import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import './Profile.css'; // Import your custom CSS file

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updatedFullName, setUpdatedFullName] = useState('');
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedProfilePicture, setUpdatedProfilePicture] = useState(null);

    const fetchProfile = async () => {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            setError('Access token not found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/profile/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Failed to fetch profile!');
            } else {
                setError('Failed to fetch profile!');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            setError('Access token not found. Please log in.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('full_name', updatedFullName);
            formData.append('username', updatedUsername);
            formData.append('email', updatedEmail);
            if (updatedProfilePicture) {
                formData.append('profile_picture', updatedProfilePicture);
            }

            await axios.put('http://localhost:8000/profileupdate/', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Fetch the updated profile
            await fetchProfile();
            setShowModal(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Failed to update profile!');
            } else {
                setError('Failed to update profile!');
            }
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
        setUpdatedFullName(user.full_name);
        setUpdatedUsername(user.username);
        setUpdatedEmail(user.email);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="profile-container rounded shadow-lg p-5 animate__animated animate__fadeInUp">
                <div className="row">
                    <div className="col-md-4 text-center">
                        {user.profile_picture ? (
                            <img src={user.profile_picture} alt={`${user.full_name}'s Profile Picture`} className="img-fluid rounded-circle profile-picture" />
                        ) : (
                            <img src="https://via.placeholder.com/150" alt="Default Profile Picture" className="img-fluid rounded-circle profile-picture" />
                        )}
                    </div>
                    <div className="col-md-8">
                        <div className="profile-info">
                            <h1 className="mb-4">{user.full_name}</h1>
                            <div className="info-item">
                                <i className="fas fa-user"></i>
                                <span>Username:</span>
                                <span className="font-weight-bold">{user.username}</span>
                            </div>
                            <div className="info-item">
                                <i className="fas fa-envelope"></i>
                                <span>Email:</span>
                                <span className="font-weight-bold">{user.email}</span>
                            </div>

                            <div className="info-item">
                                <i className="fas fa-user-tag"></i>
                                <span>Role:</span>
                                <span className="font-weight-bold">{user.role}</span>
                            </div>
                            <button className="btn btn-primary update-btn" onClick={handleShowModal}>
                                <i className="fas fa-edit"></i> Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedFullName}
                                onChange={(e) => setUpdatedFullName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUsername}
                                onChange={(e) => setUpdatedUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProfilePicture">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setUpdatedProfilePicture(e.target.files[0])}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateProfile}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Profile;