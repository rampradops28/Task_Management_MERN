import React, { useState, useContext } from 'react';
import axios from 'axios';
import { MDBIcon } from 'mdb-react-ui-kit';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserProfile.css';
import { API_ENDPOINTS } from '../config/api';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ text: 'All password fields are required', type: 'danger' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'danger' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters long', type: 'danger' });
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        API_ENDPOINTS.USER_UPDATE_PASSWORD,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { 
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Password updated successfully!', type: 'success' });
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordReset(false);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to update password. Please check your current password.',
        type: 'danger'
      });
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="profile-layout">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-info">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random&size=150`}
              alt="Profile"
              className="profile-image"
            />
            <h2 className="profile-name">{user?.username || 'User'}</h2>
            <div className="profile-role">
              <MDBIcon fas icon="user" className="me-2" />
              {user?.usertype || 'User'}
            </div>
            <div className="profile-email">
              <MDBIcon fas icon="envelope" className="me-2" />
              {user?.email}
            </div>
            <button
              className="submit-button"
              onClick={() => {
                setShowPasswordReset(!showPasswordReset);
                setMessage({ text: '', type: '' });
                setPasswordData({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }}
            >
              <MDBIcon fas icon={showPasswordReset ? 'times' : 'lock'} className="me-2" />
              {showPasswordReset ? 'Cancel' : 'Reset Password'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Alert Messages */}
          {message.text && (
            <div className={`alert alert-${message.type} mb-4`}>
              <MDBIcon
                fas
                icon={message.type === 'success' ? 'check-circle' : 'exclamation-circle'}
                className="me-2"
              />
              {message.text}
            </div>
          )}

          {/* Password Reset Form */}
          {showPasswordReset && (
            <div className="form-section">
              <h3 className="form-title">Reset Password</h3>
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                  <div className="form-outline">
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder="Current Password"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-outline">
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-outline">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>

                <div className="password-requirements">
                  <strong>Password Requirements:</strong>
                  <ul>
                    <li>At least 6 characters long</li>
                    <li>Combination of letters and numbers recommended</li>
                    <li>Special characters recommended (!@#$%^&*)</li>
                  </ul>
                </div>

                <button type="submit" className="submit-button mt-4">
                  <MDBIcon fas icon="save" className="me-2" />
                  Update Password
                </button>
              </form>
            </div>
          )}

          {!showPasswordReset && (
            <div className="text-center p-5">
              <MDBIcon fas icon="user" size="3x" className="text-muted mb-3" />
              <h3 className="text-muted">Welcome to Your Profile</h3>
              <p className="text-muted">
                Use the button on the left to manage your password and security settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 