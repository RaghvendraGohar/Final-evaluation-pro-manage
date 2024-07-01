import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import codesandbox from "../../assets/codesandbox.png";
import database from "../../assets/database.png";
import layout from "../../assets/layout.png";
import vector from "../../assets/Vector.png";
import logout from "../../assets/Logout.png";
import Analytics from "./Analytics/Analytics";
import Settings from "./Settings/Settings";
import Board from "./Board/Board";
import LogoutModal from "./LogoutModal/LogoutModal";

export default function Dashboard() {
  const [content, setContent] = useState("Board");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleClick = (name) => {
    if (name === "Log out") {
      setShowLogoutModal(true);
    } else {
      setContent(name);
    }
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    console.log("Logged out");
    setShowLogoutModal(false);
    // Add your logout logic here
  };

  const renderContent = () => {
    switch (content) {
      case "Board":
        return <Board />;
      case "Analytics":
        return <Analytics />;
      case "Settings":
        return <Settings />;
      default:
        return <Board />;
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src={codesandbox} alt="codesandbox" className={styles.sidebarIconH} />
          <span className={styles.sidebarHeading}>Pro Manage</span>
        </div>
        <div className={styles.sidebarMenu}>
          <div
            className={`${styles.sidebarItem} ${content === "Board" ? styles.active : ""}`}
            onClick={() => handleClick("Board")}
          >
            <img src={layout} alt="layout" className={styles.sidebarIcon} />
            <span className={styles.sidebarText}>Board</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${content === "Analytics" ? styles.active : ""}`}
            onClick={() => handleClick("Analytics")}
          >
            <img src={database} alt="database" className={styles.sidebarIcon} />
            <span className={styles.sidebarText}>Analytics</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${content === "Settings" ? styles.active : ""}`}
            onClick={() => handleClick("Settings")}
          >
            <img src={vector} alt="vector" className={styles.sidebarIcon} />
            <span className={styles.sidebarText}>Settings</span>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={() => handleClick("Log out")}>
          <img src={logout} alt="logout" className={styles.logoutIcon} />
          Log out
        </button>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>

      <LogoutModal show={showLogoutModal} onClose={handleCloseModal} onLogout={handleLogout} />
    </div>
  );
}
