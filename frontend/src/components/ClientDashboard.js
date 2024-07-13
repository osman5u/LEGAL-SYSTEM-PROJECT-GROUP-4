import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './clients_dashboard.css';

const ClientsDashboard = () => {


  return (
    <div>
      <h1 className="text-center shiny-text">Client Dashboard</h1>
      <div className="row justify-content-center">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-gavel fa-3x"></i>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center full-width">
              <h5 className="card-title">File Case</h5>
              <a href="/availableLawyers" className="btn btn-light btn-block">
                File Case
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-bell fa-3x"></i>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Notifications</h5>
              <a href="/notifications" className="btn btn-light btn-block">
                View Notifications
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-history fa-3x"></i>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Case History</h5>
              <a href="/caseHistory" className="btn btn-light btn-block">
                View Case History
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-file-upload fa-3x"></i>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Upload Document</h5>
              <a href="/uploadDocument" className="btn btn-light btn-block">
                Upload Document
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3 dashboard-card">
            <div className="card-header">
              <i className="fas fa-file-alt fa-3x"></i>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Document History</h5>
              <a href="/DocumentHistory" className="btn btn-light btn-block">
                Document History
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsDashboard;