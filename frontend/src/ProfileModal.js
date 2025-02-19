import React, { useState, useEffect } from "react";

function ProfileModal({ isOpen, onClose, user, cumulativeGPA, onUpdate }) {
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        status: user.status,
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
            name="name"
            value={editedUser.name}
            onChange={handleChange}
            className="profile-input"
          />
          <label className="profile-label">Email:</label>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
            className="profile-input"
          />
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
