import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Board.module.css";
import addPeopleI from "../../../assets/addPeople.png";
import AddPeople from "./AddPeopleModal/AddPeople";
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import Cards from "./Cards/Cards";
import DateFilter from "./DateFilter/DateFilter";
import collapseIcon from "../../../assets/collapseIcon.png";
import plusIcon from "../../../assets/plusIcon.png";
import { getLoggedInUserId } from "../../../utils/auth";
import { getTasksByUser, deleteTask as deleteTaskApi, updateTask as updateTaskApi } from "../../../api/task";

export default function Board() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [collapsedContainers, setCollapsedContainers] = useState({});
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filter, setFilter] = useState('This Week');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = getLoggedInUserId();
        const userEmail = localStorage.getItem('email'); // Assuming you store the email in localStorage
        const fetchedTasks = await getTasksByUser(userId, userEmail);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const openTaskModal = (task = null) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = (newTask) => {
    if (newTask) {
      if (taskToEdit) {
        setTasks(tasks.map(task => task._id === newTask._id ? newTask : task));
      } else {
        setTasks([...tasks, newTask]);
      }
    }
    setTaskToEdit(null);
    setIsTaskModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setStep(1);
    setEmail("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextStep = () => {
    if (email) {
      setStep(2);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const year = today.getFullYear();

    const nth = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${nth(day)} ${month}, ${year}`;
  };

  const moveCard = async (card, newContainer) => {
    const updatedTask = { ...card, status: newContainer };
    try {
      await updateTaskApi(card._id, { status: newContainer }, token);
      setTasks(tasks.map(task => task._id === card._id ? updatedTask : task));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const toggleCollapseContainer = (title) => {
    setCollapsedContainers(prev => ({
      ...prev,
      [title]: !prev[title] 
        }));
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTaskApi(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getFilteredTasks = () => {
    const today = new Date();
    const pastWeek = new Date();
    const futureWeek = new Date();
    const pastMonth = new Date();
    const futureMonth = new Date();
    
    pastWeek.setDate(today.getDate() - 7);
    futureWeek.setDate(today.getDate() + 7);
    pastMonth.setDate(today.getDate() - 30);
    futureMonth.setDate(today.getDate() + 30);

    if (filter === 'Today') {
      return tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      });
    }

    if (filter === 'This Week') {
      return tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= pastWeek && dueDate <= futureWeek;
      });
    }

    if (filter === 'This Month') {
      return tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= pastMonth && dueDate <= futureMonth;
      });
    }

    return tasks;
  };

  return (
    <>
      <div className={styles.dateDisplay}>{getCurrentDate()}</div>
      <div className={styles.headConatiner}>
        <h1>Board</h1>
        <div>
          <div className={styles.addPeople} onClick={openModal}>
            <img
              src={addPeopleI}
              alt="addPeople"
              className={styles.addPeopleIcon}
            />
            Add People
          </div>
        </div>
        <DateFilter setFilter={setFilter} /> {/* Pass setFilter to DateFilter component */}
      </div>

      <div className={styles.boardContainer}>
        {["Backlog", "To do", "In progress", "Done"].map((title, index) => (
          <div className={styles.column} key={index}>
            <div className={styles.columnHeader}>
              <span>{title}</span>
              <div className={styles.iconContainer}>
                {title === "To do" && (
                  <img
                    src={plusIcon}
                    alt="Add"
                    className={styles.plusIcon}
                    onClick={() => openTaskModal(null)}
                  />
                )}
                <button className={styles.expandChecklist} onClick={() => toggleCollapseContainer(title)}>
                  <img 
                    src={collapseIcon} 
                    alt="Collapse" 
                    className={collapsedContainers[title] ? styles.collapseIconExpanded : styles.collapseIconCollapsed}
                  />
                </button>
              </div>
            </div>
            <div className={styles.cardsContainer}>
              {getFilteredTasks().filter(task => task.status === title).map((task, index) => (
                <Cards key={index} card={task} moveCard={moveCard} deleteTask={deleteTask} isChecklistExpanded={!collapsedContainers[title]} openTaskModal={openTaskModal} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddPeople
          step={step}
          email={email}
          closeModal={closeModal}
          handleNextStep={handleNextStep}
          setEmail={setEmail}
        />
      )}
      {isTaskModalOpen && <AddTaskModal closeModal={closeTaskModal} taskToEdit={taskToEdit} />}
    </>
  );
}
