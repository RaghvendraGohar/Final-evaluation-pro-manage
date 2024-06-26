import React, { useState, useRef, useEffect } from 'react';
import styles from './AddTaskModal.module.css';
import { createTask, updateTask } from '../../../../api/task';
import { getAddPeople } from '../../../../api/auth';

export default function AddTaskModal({ closeModal, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [checklist, setChecklist] = useState([{ task: '', done: false }]);
  const [dueDate, setDueDate] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setPriority(taskToEdit.priority || '');
      setAssignee(taskToEdit.assignee || '');
      setChecklist(taskToEdit.checklist.map(item => ({ task: item.text, done: item.checked })) || []);
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
    }
  }, [taskToEdit]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = localStorage.getItem('userId'); // Adjust as necessary to get the current user ID
        const data = await getAddPeople(userId);
        // Ensure data is an array, if not, set it to an empty array
        if (data && Array.isArray(data.addPeople)) {
          setEmailList(data.addPeople);
        } else {
          setEmailList([]);
        }
      } catch (error) {
        console.error('Error fetching people:', error);
        setEmailList([]); // Set to an empty array on error
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
    setChecklist([...checklist, { task: '', done: false }]);
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
      checklist: checklist.map(item => ({ text: item.task, checked: item.done })),
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
    };

    const token = localStorage.getItem('token');

    try {
      if (taskToEdit) {
        const response = await updateTask(taskToEdit._id, taskData, token);
        closeModal(response.data);
      } else {
        const response = await createTask(taskData, token);
        closeModal(response.data);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleAssigneeChange = (email) => {
    setAssignee(email);
    setDropdownVisible(false);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Title <span className={styles.required}>*</span></h2>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles.modalRow}>
          <label>Select Priority <span className={styles.required}>*</span></label>
          <div className={styles.priorityButtons}>
            {['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'].map((label) => (
              <button
                key={label}
                className={`${styles.priorityButton} ${priority === label ? styles.selected : ''}`}
                onClick={() => handlePriorityChange(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.modalRow}>
          <label>Assign to</label>
          <input 
            type="text" 
            value={assignee} 
            onChange={(e) => setAssignee(e.target.value)} 
            onFocus={() => setDropdownVisible(true)}
          />
          {dropdownVisible && (
            <div className={styles.dropdown}>
              {emailList.map((email, index) => (
                <div key={index} className={styles.dropdownItem}>
                  <div className={styles.circle}>{email.slice(0, 2).toUpperCase()}</div>
                  <span>{email}</span>
                  <button onClick={() => handleAssigneeChange(email)}>Assign</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.modalRow}>
          <label>Checklist ({checklist.filter(item => item.done).length}/{checklist.length})</label>
          <div className={styles.checklist}>
            {checklist.map((item, index) => (
              <div key={index} className={styles.checklistItem}>
                <input
                  className={styles.checklistItemCheckBox}
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => handleChecklistChange(index, 'done', e.target.checked)}
                />
                <input
                  className={styles.checklistItemText}
                  type="text"
                  value={item.task}
                  onChange={(e) => handleChecklistChange(index, 'task', e.target.value)}
                />
                <button onClick={() => removeChecklistItem(index)}>Delete</button>
              </div>
            ))}
            <button onClick={addChecklistItem}>+ Add New</button>
          </div>
        </div>
        <div className={styles.modalRow}>
          <button
            className={styles.dueDateButton}
            onClick={openDatePicker}
          >
            {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select Due Date'}
          </button>
          <input
            type="date"
            ref={dateInputRef}
            value={dueDate}
            onChange={handleDateChange}
            className={styles.hiddenDateInput}
          />
        </div>
        <div className={styles.modalFooter}>
          <button onClick={() => closeModal()}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
