import React, { useState, useEffect } from "react";
import { changePassword } from "./services/api"; // Import change password API function
import eyeIcon from "./eye.png";
import eyeCrossedIcon from "./eye-crossed.png";

function ProfileModal({ isOpen, onClose, user, cumulativeGPA, onUpdate }) {
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    status: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({
        username: user.username,
        email: user.email,
        status: user.status,
      });
      setErrors({});
    }
  }, [user, isOpen]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    password.length >= 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (name === "username" && errors.username) {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(editedUser.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address." }));
      return;
    }

    if (!editedUser.username.trim() || editedUser.username.length > 20) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be 1-20 characters.",
      }));
      return;
    }

    onUpdate(editedUser);
    onClose();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(passwordData.newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Password must be at least 6 characters long.",
      }));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowChangePassword(false);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Failed to change password.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2 className="profile-title">User Profile</h2>
        <img
          src={user.avatar || require("./avatar-placeholder.png")}
          alt="Avatar"
          className="profile-avatar"
        />
        <p className="profile-status">
          <strong>Status:</strong> Student
        </p>
        <p className="profile-gpa">
          <strong>Total GPA:</strong> {cumulativeGPA}
        </p>

        {showChangePassword ? (
          <>
            <h3 className="profile-edit-title">Change Password</h3>
            <form className="profile-form" onSubmit={handleChangePassword}>
              <label className="profile-label">Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="profile-input"
              />

              <label className="profile-label">New Password:</label>
              <div className="password-input">
                <input
                  type={passwordVisible.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`profile-input ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPasswordVisible((prev) => ({
                      ...prev,
                      newPassword: !prev.newPassword,
                    }))
                  }
                >
                  <img
                    src={!passwordVisible.newPassword ? eyeCrossedIcon : eyeIcon}
                    alt="Toggle visibility"
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>
              </div>
              {errors.newPassword && (
                <p className="error-message">{errors.newPassword}</p>
              )}

              <label className="profile-label">Confirm New Password:</label>
              <div className="password-input">
                <input
                  type={passwordVisible.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`profile-input ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPasswordVisible((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                >
                  <img
                    src={
                      !passwordVisible.confirmPassword
                        ? eyeCrossedIcon
                        : eyeIcon
                    }
                    alt="Toggle visibility"
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}

              {errors.general && (
                <p className="error-message">{errors.general}</p>
              )}

              <button type="submit" className="save-btn">
                Change Password
              </button>
            </form>
            <button
              className="psw-toggle-btn"
              onClick={() => {
                setShowChangePassword(false);
                setErrors({});
              }}
            >
              Back to Edit Profile
            </button>
          </>
        ) : (
          <>
            <h3 className="profile-edit-title">Edit Profile</h3>
            <form className="profile-form" onSubmit={handleSubmit}>
              <label className="profile-label">Username:</label>
              <input
                type="text"
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                className={`profile-input ${
                  errors.username ? "input-error" : ""
                }`}
              />
              {errors.username && (
                <p className="error-message">{errors.username}</p>
              )}

              <label className="profile-label">Email:</label>
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className={`profile-input ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
              <div className="psw-container">
                <button
                  className="psw-toggle-btn"
                  onClick={() => {
                    setShowChangePassword(true);
                    setErrors({});
                  }}
                >
                  Change Password
                </button>
              </div>

              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
            <button className="profile-close-btn" onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
