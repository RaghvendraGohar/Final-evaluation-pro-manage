import React, { useEffect, useState } from 'react';
import { getTasksByUser } from '../../../api/task';
import styles from "./Analytics.module.css";

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({
    backlog: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
    dueDate: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await getTasksByUser(userId);
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const calculateCounts = () => {
      const now = new Date();
      const newCounts = {
        backlog: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        lowPriority: 0,
        moderatePriority: 0,
        highPriority: 0,
        dueDate: 0,
      };

      tasks.forEach(task => {
        // Calculate task status counts
        if (task.status === 'Backlog') newCounts.backlog++;
        if (task.status === 'To do') newCounts.todo++;
        if (task.status === 'In progress') newCounts.inProgress++;
        if (task.status === 'Done') newCounts.completed++;

        // Calculate task priority counts
        if (task.priority === 'LOW PRIORITY') newCounts.lowPriority++;
        if (task.priority === 'MODERATE PRIORITY') newCounts.moderatePriority++;
        if (task.priority === 'HIGH PRIORITY') newCounts.highPriority++;

        // Calculate due date tasks count
        if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done') {
          newCounts.dueDate++;
        }
      });

      setCounts(newCounts);
    };

    calculateCounts();
  }, [tasks]);

  return (
    <>
      <h1>Analytics</h1>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            Backlog Tasks
            <span className={styles.count}>{counts.backlog}</span>
          </div>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            To-do Tasks
            <span className={styles.count}>{counts.todo}</span>
          </div>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            In-Progress Tasks
            <span className={styles.count}>{counts.inProgress}</span>
          </div>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            Completed Tasks
            <span className={styles.count}>{counts.completed}</span>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            Low Priority
            <span className={styles.count}>{counts.lowPriority}</span>
          </div>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            Moderate Priority
            <span className={styles.count}>{counts.moderatePriority}</span>
          </div>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            High Priority
            <span className={styles.count}>{counts.highPriority}</span>
          </div>
          <div className={styles.task}>
            <span className={styles.dot}></span>
            Due Date Tasks
            <span className={styles.count}>{counts.dueDate}</span>
          </div>
        </div>
      </div>
    </>
  );
}
