import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth"; // Adjust the path as necessary
import styles from "./Login.module.css";
import astronaut from "../../assets/Art.png";

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      console.log(response);
      // Save token and user info in local storage or context
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userName', response.name);
      localStorage.setItem('token',response.token)
      localStorage.setItem('email',response.email)
      // Navigate to settings or any other page after successful login
      navigate('/dashboard');
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
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button type="submit" className={styles.registerButton}>
            Log in
          </button>
          
          <p className={styles.loginText}>Have no account yet?</p>
          
          <button type="button" className={styles.loginButton} onClick={() => navigate('/register')}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
