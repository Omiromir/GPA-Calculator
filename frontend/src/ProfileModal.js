import React, { useState, useEffect } from "react";

function ProfileModal({ isOpen, onClose, user, cumulativeGPA, onUpdate }) {
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    status: "",
  });
  const [errors, setErrors] = useState({}); // State to store validation errors

  // Update editedUser when user or isOpen changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        username: user.username,
        email: user.email,
        status: user.status,
      });
    }
  }, [user, isOpen]);

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));

    // Clear errors when the user starts typing
    if (name === "email" && errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(editedUser.email)) {
      setErrors({ email: "Please enter a valid email address." });
      return; // Stop form submission if email is invalid
    }

    // If validation passes, call onUpdate and close the modal
    onUpdate(editedUser);
    onClose();
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
          <strong>Status:</strong> {user.status}
        </p>
        <p className="profile-gpa">
          <strong>Total GPA:</strong> {cumulativeGPA}
        </p>
        <h3 className="profile-edit-title">Edit Profile</h3>
        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="profile-label">Username:</label>
          <input
            type="text"
            name="username"
            value={editedUser.username}
            onChange={handleChange}
            className="profile-input"
          />
          <label className="profile-label">Email:</label>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
            className={`profile-input ${errors.email ? "input-error" : ""}`} // Add error class if email is invalid
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p> // Display error message
          )}
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
        <button className="profile-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;