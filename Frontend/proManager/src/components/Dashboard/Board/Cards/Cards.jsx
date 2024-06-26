import React, { useState, useEffect, useRef } from 'react';
import styles from './Cards.module.css';

const Cards = ({ card, moveCard, deleteTask, isChecklistExpanded: isChecklistExpandedProp, openTaskModal }) => {
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(isChecklistExpandedProp);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsChecklistExpanded(isChecklistExpandedProp);
  }, [isChecklistExpandedProp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const getDueDateStyles = () => {
    const currentDate = new Date();
    const dueDate = new Date(card.dueDate);

    if (card.status === 'Done') {
      return {
        backgroundColor: '#63C05B',
        color: '#FFFFFF',
        cursor: 'default',
        pointerEvents: 'none',
      };
    } else if (dueDate < currentDate) {
      return {
        backgroundColor: '#CF3636',
        color: '#FFFFFF',
        cursor: 'default',
        pointerEvents: 'none',
      };
    } else {
      return {
        backgroundColor: '#DBDBDB',
        color: '#5A5A5A',
        cursor: 'default',
        pointerEvents: 'none',
      };
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={`${styles.priorityIndicator} ${styles[card.priority.toLowerCase().replace(' ', '')]}`}></div>
        <div className={styles.priorityName}>{card.priority}</div>
        <div className={styles.cardMenu} onClick={toggleMenu}>...</div>
        {isMenuOpen && (
          <div className={styles.menuPopup} ref={menuRef}>
            <button onClick={() => { closeMenu(); openTaskModal(card); }}>Edit</button>
            <button onClick={() => { closeMenu(); /* Add share functionality */ }}>Share</button>
            <button onClick={openModal}>Delete</button>
          </div>
        )}
      </div>
      <div className={styles.cardTitle}>{card.title}</div>
      <div className={styles.cardChecklist}>
        Checklist ({card.checklist.filter(item => item.checked).length}/{card.checklist.length})
        <button className={styles.expandChecklist} onClick={toggleChecklist}>
          {isChecklistExpanded ? '▲' : '▼'}
        </button>
      </div>
      {isChecklistExpanded && (
        <ul className={styles.checklistItems}>
          {card.checklist.map(item => (
            <li key={item._id}>
              <input type="checkbox" checked={item.checked} readOnly />
              {item.text}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.cardFooter}>
        <button className={styles.dateIndicator} style={getDueDateStyles()}>
          {card.dueDate ? new Date(card.dueDate).toLocaleDateString() : 'No due date'}
        </button>
        <div className={styles.cardActions}>
          {['Backlog', 'To do', 'In progress', 'Done'].filter(container => container !== card.status).map(container => (
            <button key={container} onClick={() => moveCard(card, container)}>{container}</button>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete?</p>
            <button onClick={handleDelete} className={styles.deleteButton}>Yes, Delete</button>
            <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
