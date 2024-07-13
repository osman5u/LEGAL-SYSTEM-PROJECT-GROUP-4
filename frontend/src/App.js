import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import ClientDashboard from './components/ClientDashboard';
import LawyerDashboard from './components/LawyerDashboard';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FileCase from './components/FileCase';
import FileCaseView from './components/FileCaseView';
import AvailableLawyers from './components/AvailableLawyers';
import Notifications from './components/Notifications';
import CaseHistory from './components/CaseHistory';
import UploadDocument from './components/UploadDocument';
import DocumentHistory from './components/DocumentHistory';
import PendingCases from './components/PendingCases';
import ApprovedCases from './components/Approved-cases';
import RejectedCases from './components/RejectedCases';
import Documents from './components/Documents';

const PrivateRoute = ({ element: Element, role, ...rest }) => {
    const isAuthorized = localStorage.getItem('access') && localStorage.getItem('role') === role;

    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    return <Element {...rest} />;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/clientDashboard" element={<PrivateRoute element={ClientDashboard} role="client" />} />
                <Route path="/lawyerDashboard" element={<PrivateRoute element={LawyerDashboard} role="lawyer" />} />
                <Route path="/fileCase" element={<PrivateRoute element={FileCase} role="client" />} />
                <Route path="/fileCaseView/:lawyerId" element={<PrivateRoute element={FileCaseView} role="client" />} />
                <Route path="/availableLawyers" element={<AvailableLawyers />} />
                <Route path="/notifications" element={<PrivateRoute element={Notifications} role="client" />} />
                <Route path="/caseHistory" element={<PrivateRoute element={CaseHistory} role="client" />} />
                <Route path="/uploadDocument" element={<PrivateRoute element={UploadDocument} role="client" />} />
                <Route path="/documentHistory" element={<PrivateRoute element={DocumentHistory} role="client" />} />
                <Route path="/pending-cases" element={<PrivateRoute element={PendingCases} role="lawyer" />} />
                <Route path="/approved-cases" element={<PrivateRoute element={ApprovedCases} role="lawyer" />} />
                <Route path="/lawyer/rejected-cases" element={<PrivateRoute element={RejectedCases} role="lawyer" />} />
                <Route path="/lawyer/documents" element={<PrivateRoute element={Documents} role="lawyer" />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
