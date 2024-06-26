import React from 'react'
import styles from "./PublicLink.module.css"
import codesandbox from "../../assets/codesandbox.png";


export default function PublicLink() {
    const checklistItems = [
        { id: 1, text: 'Done Task', completed: true },
        { id: 2, text: 'Task to be done', completed: false },
        { id: 3, text: 'Task to be done', completed: false },
        { id: 4, text: 'Task to be done', completed: false },
        { id: 5, text: 'Task to be done', completed: false },
        { id: 6, text: 'Task to be done', completed: false },
        { id: 7, text: 'Task to be done', completed: false },
        { id: 8, text: 'Lorem ipsum dolor sit amet consectetur. Sem duis morbi elementum sagittis placerat proin aliquet sem.', completed: false },
      ];
    
      return (
        <div className={styles.container}>
          <div className={styles.header}>
          <img src={codesandbox} alt="codesandbox" className={styles.sidebarIcon} />
            <h1>Pro Manage</h1>
          </div>
          <div className={styles.card}>
            <div className={styles.priority}>
              <span className={styles.priorityIndicator}></span>
              <span>HIGH PRIORITY</span>
            </div>
            <h2 className={styles.heroSection}>Hero section</h2>
            <div className={styles.checklistContainer}>
              <h3>Checklist (1/12)</h3>
              <div className={styles.checklist}>
                {checklistItems.map(item => (
                  <label key={item.id} className={styles.checklistItem}>
                    <input type="checkbox" checked={item.completed} readOnly />
                    {item.text}
                  </label>
                ))}
              </div>
              <div className={styles.dueDate}>
                <span>Due Date</span>
                <span className={styles.dueDateIndicator}>Feb 10th</span>
              </div>
            </div>
          </div>
        </div>
      );
}
