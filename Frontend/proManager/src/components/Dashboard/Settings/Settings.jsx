import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../api/auth";
import styles from "./Settings.module.css";
import mail from "../../../assets/email.png";
import lock from "../../../assets/lock.png";
import hide from "../../../assets/hide.png";
import see from "../../../assets/see.png";
import nameIcon from "../../../assets/nameIcon.png";

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('User ID not found in local storage.');
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await updateUser(userId, name, email, oldPassword, newPassword);
      console.log(response);
      setName('');
      setEmail('');
      setOldPassword('');
      setNewPassword('');
      if (email || (oldPassword && newPassword)) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <>
      <h1>Settings</h1>
      <div className={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
          <img src={nameIcon} alt="nameIcon" className={styles.icons} />
            <input 
            type="text" 
            placeholder="Name" 
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
          </div>
          <div>
          <img src={mail} alt="mail" className={styles.icons} />
          <input 
            type="email" 
            placeholder="Update Email" 
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          </div>
          
          <div>
          <img src={lock} alt="lock" className={styles.icons} />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Old Password" 
            className={styles.formInput}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)} 
          />
          <img
              src={showPassword ? hide : see}
              alt={showPassword ? "Hide password" : "Show password"}
              className={styles.icon1}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            />
          </div>
          
          <div>
          <img src={lock} alt="lock" className={styles.icons} />
            <input 
            type={showPassword ? "text" : "password"} 
            placeholder="New Password" 
            className={styles.formInput}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <img
              src={showPassword ? hide : see}
              alt={showPassword ? "Hide password" : "Show password"}
              className={styles.icon1}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            />
          </div>
          
        </form>
        <button 
          type="button" 
          className={styles.updateButton} 
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
    </>
  );
}
