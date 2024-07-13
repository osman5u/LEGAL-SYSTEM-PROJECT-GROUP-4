import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css'; // Import FontAwesome CSS
import './Register.css'; // Import the CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        role: 'client',
        profile_picture: null,
        password: '',
        confirm_password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';

        // Validate username
        if (name === 'username' && !(/^[a-zA-Z0-9]+$/.test(value))) {
            errorMessage = 'Username must contain only letters and numbers.';
        }
        // Validate full name
        else if (name === 'full_name' && !(/^[a-zA-Z\s]+$/.test(value))) {
            errorMessage = 'Full name must contain only letters.';
        }
        // Validate password
        else if (name === 'password') {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(value)) {
                errorMessage = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
            }
        }
        // Validate confirm password
        else if (name === 'confirm_password' && value !== formData.password) {
            errorMessage = 'Passwords do not match.';
        }

        setFormData({ ...formData, [name]: value });
        setPasswordError(errorMessage);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profile_picture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataWithFile = new FormData();
        Object.keys(formData).forEach(key => {
            formDataWithFile.append(key, formData[key]);
        });

        try {
            await axios.post('http://localhost:8000/register/', formDataWithFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Registration successful!');
        } catch (error) {
            console.error(error.response.data);
            alert('Registration failed!');
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="register-container rounded shadow-lg p-5 animate__animated animate__fadeInUp">
                <div className="row align-items-center">
                    <div className="col-md-6 left-column">
                        <img src={`${process.env.PUBLIC_URL}/static/img/login.jpg`} alt="Register Image" className="img-fluid register-image" />
                    </div>
                    <div className="col-md-6 right-column">
                        <div className="register-form-container">
                            <h1 className="text-center mb-4">Register</h1>
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="register-form">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {formData.username && !/^[a-zA-Z0-9]+$/.test(formData.username) && (
                                        <div className="alert alert-danger mt-2">
                                            Username must contain only letters and numbers.
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="full_name"
                                            placeholder="Full Name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {formData.full_name && !/^[a-zA-Z\s]+$/.test(formData.full_name) && (
                                        <div className="alert alert-danger mt-2">
                                            Full name must contain only letters.
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                        </div>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="display-none">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-user-tag"></i></span>
                                        </div>
                                        <select
                                            className="form-control"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="client">Client</option>
                                            <option value="lawyer">Lawyer</option>
                                            <option value="judge">Judge</option>
                                        </select>
                                    </div>
                                </div>
                                    </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-file"></i></span>
                                        </div>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="profile_picture"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text" onClick={togglePassword}>
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </span>
                                        </div>
                                    </div>
                                    {passwordError && (
                                        <div className="alert alert-danger mt-2">
                                            {passwordError}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            name="confirm_password"
                                            placeholder="Confirm Password"
                                            value={formData.confirm_password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text" onClick={togglePassword}>
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </span>
                                        </div>
                                    </div>
                                    {formData.confirm_password && formData.confirm_password !== formData.password && (
                                        <div className="alert alert-danger mt-2">
                                            Passwords do not match.
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;