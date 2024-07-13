import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css'; // Import FontAwesome CSS
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login/', formData);
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            localStorage.setItem('role', response.data.role);

            if (response.data.role === 'client') {
                navigate('/ClientDashboard');
            } else if (response.data.role === 'lawyer') {
                navigate('/lawyerDashboard');
            } else if (response.data.role === 'judge') {
                navigate('/judgeDashboard');
            }
        } catch (error) {
            console.error(error.response.data);
            alert('The User is not Exist!');
        }
    };

    return (
         <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="login-container rounded shadow-lg p-5 animate__animated animate__fadeInUp">
                <div className="row align-items-center">
                    <div className="col-md-6 left-column">
                       <img src={`${process.env.PUBLIC_URL}/static/img/login.jpg`} alt="Login Image" className="img-fluid login-image" />
                    </div>
                    <div className="col-md-6 right-column">
                        <div className="login-form-container">
                            <h1 className="text-center mb-4">Login</h1>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend d-flex align-items-center pr-2">
                                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend d-flex align-items-center pr-2">
                                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary login-button" style={{ backgroundColor: '#28ce03', borderColor: '#28ce03' }}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;