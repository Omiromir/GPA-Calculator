import React, { useState, useEffect } from "react";
import { getAllUsersWithGPA, deleteUserById } from "./services/api";
import Loader from "./Loader";

function AdminPanel({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersWithGPA();
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
      </header>
      <main className="admin-main">
        <h2 className="admin-section-title">All Users</h2>
        <table className="admin-table">
          <thead className="admin-table-head">
            <tr className="admin-table-row">
              <th className="admin-table-header">Username</th>
              <th className="admin-table-header">Email</th>
              <th className="admin-table-header">Cumulative GPA</th>
              <th className="admin-table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {users.map((user) => (
              <tr key={user._id} className="admin-table-row">
                <td className="admin-table-cell">{user.username}</td>
                <td className="admin-table-cell">{user.email}</td>
                <td className="admin-table-cell">{user.cumulativeGPA}</td>
                <td className="admin-table-cell">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="admin-delete-btn"
                    disabled={user.isAdmin}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <div className="admin-footer">
        <button onClick={onLogout} className="logoutBtn">
            Logout
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
