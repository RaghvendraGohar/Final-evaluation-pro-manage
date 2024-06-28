import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth"; 
import styles from "./Login.module.css";
import astronaut from "../../assets/Art.png";
import mail from "../../assets/email.png";
import lock from "../../assets/lock.png";
import hide from "../../assets/hide.png";
import see from "../../assets/see.png";

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
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
            <img src={mail} alt="mail" className={styles.icons} />
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
            <img src={lock} alt="lock" className={styles.icons} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? hide : see}
              alt={showPassword ? "Hide password" : "Show password"}
              className={styles.icon1}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Log in
          </button>
          <p className={styles.loginText}>Have no account yet?</p>
        </form>
        <button type="button" className={styles.registerButton} onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
}
