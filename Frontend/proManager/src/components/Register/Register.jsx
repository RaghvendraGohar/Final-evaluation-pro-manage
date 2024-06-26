import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth"; // Adjust the path as necessary
import styles from "./Register.module.css";
import astronaut from "../../assets/Art.png";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await registerUser(name, email, password);
      console.log(response);
      // Redirect to login or another page
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={astronaut} alt="Astronaut" className={styles.image} />
        <p className={styles.imageP1}>Welcome aboard my friend</p>
        <p className={styles.imageP2}>just a couple of clicks and we start</p>
      </div>
      <div className={styles.rightSide}>
        <h2 className={styles.title}>Register</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              required 
              className={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
          
          <p className={styles.loginText}>Have an account?</p>
          
          <button type="button" className={styles.loginButton} onClick={() => navigate('/login')}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
