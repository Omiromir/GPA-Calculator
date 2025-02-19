import React, { useState } from "react";
import ProfileModal from "./ProfileModal"; 

function Nav({ onLogOut, user, cumulativeGPA, onUserUpdate }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="app-nav">
      <div className="avatar__container" onClick={() => setIsProfileOpen(true)}>
        <div className="avatar-image">
          <img
            src={require("./avatar-placeholder.png")}
            alt="User Avatar"
          />
        </div>
        <p className="avatar-name">
          Hi,{" "}
          <span style={{ color: "#00A3FF", fontWeight: "600" }}>
            {user.name}
          </span>{" "}
          👋
        </p>
      </div>
      <h2 className="app-title">
        GPA <span style={{ color: "#00A3FF", fontWeight: "500" }}>Calculator</span>
      </h2>
      <button onClick={onLogOut} className="logoutBtn">
        Logout
      </button>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        cumulativeGPA={cumulativeGPA}
        onUpdate={onUserUpdate}
      />
    </nav>
  );
}

export default Nav;
