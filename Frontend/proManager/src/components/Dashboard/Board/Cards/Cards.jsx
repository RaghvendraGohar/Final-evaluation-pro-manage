import React, { useState, useEffect, useRef } from "react";
import styles from "./Cards.module.css";
import up from "../../../../assets/up.png";
import down from "../../../../assets/down.png";

const Cards = ({
  card,
  moveCard,
  deleteTask,
  isChecklistExpanded: isChecklistExpandedProp,
  openTaskModal,
}) => {
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(
    isChecklistExpandedProp
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    setIsChecklistExpanded(isChecklistExpandedProp);
  }, [isChecklistExpandedProp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleChecklist = () => {
    setIsChecklistExpanded(!isChecklistExpanded);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    closeMenu();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteTask(card._id);
    closeModal();
  };

  const getDueDateText = () => {
    const dueDate = new Date(card.dueDate);
    if (!card.dueDate) return "No due date";

    const options = { month: "short", day: "numeric" };
    const formattedDate = dueDate.toLocaleDateString("en-US", options);

    const day = dueDate.getDate();
    const daySuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${formattedDate}${daySuffix}`;
  };

  const getDueDateStyles = () => {
    const currentDate = new Date();
    const dueDate = new Date(card.dueDate);

    if (card.status === "Done") {
      return { backgroundColor: "#63C05B", color: "#FFFFFF" };
    } else if (dueDate < currentDate) {
      return { backgroundColor: "#CF3636", color: "#FFFFFF" };
    } else {
      return { backgroundColor: "#DBDBDB", color: "#5A5A5A" };
    }
  };

  const copyToClipboard = (text) => {
    text = "localhost:5173/public/" + text;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Share link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const getInitials = (email) => {
    if (!email) return "";
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.priority}>
          <div
            className={`${styles.priorityIndicator} ${
              styles[card.priority.toLowerCase().replace(" ", "")]
            }`}
          ></div>
          <div className={styles.priorityName}>{card.priority}</div>

          {card.assignUserId && (
            <div className={styles.assignUserIndicator}>
              {getInitials(card.assignUserId)}
            </div>
          )}
        </div>
        <div className={styles.cardMenu} onClick={toggleMenu}>
          ...
        </div>
        {isMenuOpen && (
          <div className={styles.menuPopup} ref={menuRef}>
            <button
              className={styles.menuPopupButton}
              onClick={() => {
                closeMenu();
                openTaskModal(card);
              }}
            >
              Edit
            </button>
            <button
              className={styles.menuPopupButton}
              onClick={() => {
                closeMenu();
                copyToClipboard(card.shareLink);
              }}
            >
              Share
            </button>
            <button className={styles.menuPopupButtonD} onClick={openModal}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={styles.cardTitle}>{card.title}</div>
      <div className={styles.cardChecklist}>
        Checklist ({card.checklist.filter((item) => item.checked).length}/
        {card.checklist.length})
        <button className={styles.expandChecklist} onClick={toggleChecklist}>
          {isChecklistExpanded ? (
            <img src={up} alt="up" className={styles.checklistArrow} />
          ) : (
            <img src={down} alt="down" className={styles.checklistArrow} />
          )}
        </button>
      </div>
      {isChecklistExpanded && (
        <ul className={styles.checklistItems}>
          {card.checklist.map((item) => (
            <li key={item._id}>
              <input type="checkbox" checked={item.checked} readOnly />
              {item.text}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.cardFooter}>
        <button className={styles.dateIndicator} style={getDueDateStyles()}>
          {card.dueDate ? getDueDateText() : "No due date"}
        </button>
        <div className={styles.cardActions}>
          {["Backlog", "To do", "In progress", "Done"]
            .filter((container) => container !== card.status)
            .map((container) => (
              <button key={container} onClick={() => moveCard(card, container)}>
                {container}
              </button>
            ))}
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Are you sure you want to delete?</h2>
            <div className={styles.modalActions}>
              <button onClick={handleDelete} className={styles.deleteButton}>
                Yes, Delete
              </button>
              <button onClick={closeModal} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
