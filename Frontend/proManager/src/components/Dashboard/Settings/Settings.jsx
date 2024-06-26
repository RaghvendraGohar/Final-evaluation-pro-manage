import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../api/auth"; // Adjust the path as necessary
import styles from "./Settings.module.css";

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('User ID not found in local storage.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(userId, name, email, oldPassword, newPassword);
      console.log(response);
      // Show success message or update UI as necessary
      setName('');
      setEmail('');
      setOldPassword('');
      setNewPassword('');
      if (email || (oldPassword && newPassword)) {
        localStorage.removeItem('userId'); // Clear user info from local storage
        localStorage.removeItem('userName');
        navigate('/login'); // Redirect to login page
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Settings</h1>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name" 
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Update Email" 
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Old Password" 
            className={styles.formInput}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className={styles.formInput}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <button type="submit" className={styles.updateButton}>Update</button>
        </form>
      </div>
    </>
  );
}