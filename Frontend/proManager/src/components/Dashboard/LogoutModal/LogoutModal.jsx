// LogoutModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
import styles from "./LogoutModal.module.css";

const LogoutModal = ({ show, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage or any other logout-related actions
    localStorage.clear(); // Example: Clear localStorage

    // Navigate to /login after logout
    navigate("/login");
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Are you sure you want to logout?</h2>
        <div className={styles.modalActions}>
          <button 
            onClick={() => {
              handleLogout(); // Call handleLogout to clear localStorage and navigate
            }} 
            className={styles.logoutButton}
          >
            Yes, Logout
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
