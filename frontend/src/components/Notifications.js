import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/notificationsList/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <p className="no-notifications">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="no-notifications">No new notifications.</p>
      ) : (
        <ol className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.id} className="notifications-item">
              <div className="notification-content">
                <h3 className="notification-case-title">{notification.case.title}</h3>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-message">with {notification.recipient}</p>
                <p className="notification-timestamp">
                  {moment(notification.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Notifications;