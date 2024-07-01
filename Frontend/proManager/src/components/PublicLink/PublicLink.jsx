import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTasksByshareLink } from '../../api/task';
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
    return <div>Loading...</div>;
  }

  // Determine priority class based on task priority
  const priorityClass = {
    'HIGH PRIORITY': styles.highpriority,
    'MODERATE PRIORITY': styles.moderatepriority,
    'LOW PRIORITY': styles.lowpriority
  }[task.priority] || '';

  // Format due date as 'Feb 10th'
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', options);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return `${formattedDate}${suffix}`;
  };

  return (
    <>
      <div className={styles.header}>
        <img src={codesandbox} alt="codesandbox" className={styles.sidebarIcon} />
        <h1>Pro Manage</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={`${styles.priority} ${priorityClass}`}>
            <span className={styles.priorityIndicator}></span>
            <span className={styles.priorityIndicatorText}>{task.priority}</span>
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
              <span className={styles.dueDateIndicator}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicLink;
