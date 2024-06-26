import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTasksByshareLink } from '../../api/task'; // Adjust the path as per your project structure
import styles from "./PublicLink.module.css";
import codesandbox from "../../assets/codesandbox.png";

const PublicLink = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTasksByshareLink(id);
        setTask(taskData);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) {
    return <div>Loading...</div>; // Add a loading state or spinner
  }

  // Render task details
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={codesandbox} alt="codesandbox" className={styles.sidebarIcon} />
        <h1>Pro Manage</h1>
      </div>
      <div className={styles.card}>
        <div className={styles.priority}>
          <span className={styles.priorityIndicator}></span>
          <span>{task.priority}</span>
        </div>
        <h2 className={styles.heroSection}>{task.title}</h2>
        <div className={styles.checklistContainer}>
          <h3>Checklist ({task.checklist.filter(item => item.checked).length}/{task.checklist.length})</h3>
          <div className={styles.checklist}>
            {task.checklist.map(item => (
              <label key={item._id} className={styles.checklistItem}>
                <input type="checkbox" checked={item.checked} readOnly />
                {item.text}
              </label>
            ))}
          </div>
          <div className={styles.dueDate}>
            <span>Due Date</span>
            <span className={styles.dueDateIndicator}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLink;
