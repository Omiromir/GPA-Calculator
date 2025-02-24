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
      <header>
        <h1>Admin Panel</h1>
        <button onClick={onLogout} className="logoutBtn">
          Logout
        </button>
      </header>
      <main>
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Cumulative GPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.cumulativeGPA}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="delete-btn"
                    disabled={user.isAdmin} // Нельзя удалить админа
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default AdminPanel;