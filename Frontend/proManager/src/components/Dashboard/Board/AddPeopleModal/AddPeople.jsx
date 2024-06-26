import React, { useState } from "react";
import styles from "./AddPeople.module.css";
import { addPersonToUser } from "../../../../api/auth";

export default function AddPeople({ step, email, closeModal, handleNextStep, setEmail }) {
  const [error, setError] = useState(null);

  const handleAddEmail = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
      await addPersonToUser(userId,email);
      handleNextStep();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {step === 1 ? (
          <>
            <h2>Add people to the board</h2>
            <input
              type="email"
              placeholder="Enter the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleAddEmail}>Add Email</button>
            </div>
          </>
        ) : (
          <>
            <p>{email} added to board</p>
            <button onClick={closeModal}>Okay, got it!</button>
          </>
        )}
      </div>
    </div>
  );
}