import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        profile_picture: null, // Add profile picture to form data
        // Add other fields as needed
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user's current profile data and populate the form fields
        const fetchProfile = async () => {
            const accessToken = localStorage.getItem('access');
            if (!accessToken) {
                setError('Access token not found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/profile/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const { full_name, email } = response.data;
                setFormData({ full_name, email });
            } catch (error) {
                console.error(error);
                setError('Failed to fetch profile data.');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'profile_picture') {
            setFormData({ ...formData, profile_picture: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = localStorage.getItem('access');

        const formDataToSubmit = new FormData();
        for (const key in formData) {
            formDataToSubmit.append(key, formData[key]);
        }

        try {
            await axios.put('http://localhost:8000/profile/', formDataToSubmit, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            navigate('/profile'); // Redirect to the profile page after updating
        } catch (error) {
            console.error(error);
            setError('Failed to update profile.');
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1>Update Profile</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profile_picture">Profile Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        id="profile_picture"
                        name="profile_picture"
                        onChange={handleChange}
                    />
                </div>
                {/* Add other form fields for updating profile */}
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
