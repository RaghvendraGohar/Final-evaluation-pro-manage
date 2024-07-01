import React, { useState, useEffect, useRef } from "react";
import styles from "./AddTaskModal.module.css"; // Make sure the correct path is used for styles import
import { createTask, updateTask } from "../../../../api/task";
import { getAddPeople } from "../../../../api/auth";
import deleteIcon from "../../../../assets/Delete.png";

export default function AddTaskModal({ closeModal, taskToEdit }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [checklist, setChecklist] = useState([{ task: "", done: false }]);
  const [dueDate, setDueDate] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Track if alert should be shown
  const dateInputRef = useRef(null);
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setPriority(taskToEdit.priority || "");
      setAssignee(taskToEdit.assignUserId || "");
      setChecklist(
        taskToEdit.checklist.map((item) => ({
          task: item.text,
          done: item.checked,
        })) || []
      );
      setDueDate(
        taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [taskToEdit]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getAddPeople(userId);
        if (data && Array.isArray(data.addPeople)) {
          setEmailList(data.addPeople);
        } else {
          setEmailList([]);
        }
      } catch (error) {
        console.error("Error fetching people:", error);
        setEmailList([]);
      }
    }
    fetchData();
  }, []);

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const handleChecklistChange = (index, field, value) => {
    const newChecklist = [...checklist];
    newChecklist[index][field] = value;
    setChecklist(newChecklist);
  };

  const addChecklistItem = () => {
    setChecklist([...checklist, { task: "", done: false }]);
  };

  const removeChecklistItem = (index) => {
    const newChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(newChecklist);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDueDate(selectedDate);
  };

  const handleSave = async () => {
    const taskData = {
      title,
      priority,
      assignUserId: assignee,
      checklist: checklist.map((item) => ({
        text: item.task,
        checked: item.done,
      })),
      dueDate: dueDate ? new Date(dueDate).toISOString() : "",
    };

    const token = localStorage.getItem("token");

    try {
      if (taskToEdit) {
        const response = await updateTask(taskToEdit._id, taskData, token);
        closeModal(response.data);
      } else {
        const response = await createTask(taskData, token);
        closeModal(response.data);
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleAssigneeFocus = () => {
    if (taskToEdit && taskToEdit.assignUserId === userEmail) {
      if (!showAlert) {
        setShowAlert(true); // Show alert only once per click
        alert("You cannot reassign the task");
      }
      setDropdownVisible(false); // Hide dropdown when showing alert
      // Disable the input field
      setAssignee("");
    } else {
      setShowAlert(false); // Reset showAlert state when focusing on assignee
      setDropdownVisible(true); // Show dropdown for assigning
    }
  };

  const handleAssigneeChange = (email) => {
    setAssignee(email);
    setDropdownVisible(false);
    setShowAlert(false); // Reset showAlert state when changing assignee
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>
            Title <span className={styles.required}>*</span>
          </h2>
          <input
            className={styles.modalHeaderInput}
            type="text"
            placeholder="Enter Task Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.modalRow}>
          <label>
            Select Priority <span className={styles.required}>*</span>
          </label>
          <div className={styles.priorityButtons}>
            {["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"].map(
              (label) => (
                <button
                  key={label}
                  className={`${styles.priorityButton} ${
                    priority === label ? styles.selected : ""
                  }`}
                  onClick={() => handlePriorityChange(label)}
                >
                  <span
                    className={`${styles.priorityDot} ${styles[label
                      .toLowerCase()
                      .replace(" ", "-").trim()]}`}
                  ></span>
                  {label}
                </button>
              )
            )}
          </div>
        </div>
        <div className={styles.modalRowA}>
          <label>Assign to</label>
          <input
            className={styles.modalRowAInpte}
            type="text"
            value={assignee}
            placeholder="Add a assignee"
            onChange={(e) => setAssignee(e.target.value)}
            onFocus={handleAssigneeFocus}
            disabled={taskToEdit && taskToEdit.assignUserId === userEmail}
          />
          {dropdownVisible && (
            <div className={styles.dropdown}>
              {emailList.map((email, index) => (
                <div key={index} className={styles.dropdownItem}>
                  <div className={styles.circle}>
                    {email.slice(0, 2).toUpperCase()}
                  </div>
                  <span>{email}</span>
                  <button onClick={() => handleAssigneeChange(email)}>
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.modalRowCheckList}>
          <label>
            Checklist ({checklist.filter((item) => item.done).length}/
            {checklist.length})
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.checklist}>
            {checklist.map((item, index) => (
              <div key={index} className={styles.checklistItem}>
                <input
                  className={styles.checklistItemCheckBox}
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) =>
                    handleChecklistChange(index, "done", e.target.checked)
                  }
                />
                <input
                  className={styles.checklistItemText}
                  type="text"
                  value={item.task}
                  onChange={(e) =>
                    handleChecklistChange(index, "task", e.target.value)
                  }
                />
                <button
                  className={styles.checklistItemDelete}
                  onClick={() => removeChecklistItem(index)}
                >
                  <img
                    className={styles.checklistItemDeleteIcon}
                    src={deleteIcon}
                    alt="deleteIcon"
                  />
                </button>
              </div>
            ))}
            <button className={styles.addListButton} onClick={addChecklistItem}>
              + Add New
            </button>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <div className={styles.modalRowDue}>
            <button className={styles.dueDateButton} onClick={openDatePicker}>
              {dueDate
                ? new Date(dueDate).toLocaleDateString()
                : "Select Due Date"}
            </button>
            <input
              type="date"
              ref={dateInputRef}
              value={dueDate}
              onChange={handleDateChange}
              className={styles.hiddenDateInput}
            />
          </div>
          <div className={styles.modalFooterActions}>
            <button
              className={styles.modalFooterCancle}
              onClick={() => closeModal()}
            >
              Cancel
            </button>
            <button className={styles.modalFooterSave} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
