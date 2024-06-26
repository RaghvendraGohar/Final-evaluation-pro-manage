import React, { useState } from 'react';
import styles from "./DateFilter.module.css";

export default function DateFilter({ setFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('This Week');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setFilter(option);  // Update the filter state in the parent component
    setIsOpen(false);
  };

  return (
    <div className={styles.dateFilter}>
      <button className={styles.dropdownButton} onClick={toggleDropdown}>
        {selectedOption} ▼
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownItem} onClick={() => handleOptionClick('Today')}>
            Today
          </div>
          <div className={styles.dropdownItem} onClick={() => handleOptionClick('This Week')}>
            This Week
          </div>
          <div className={styles.dropdownItem} onClick={() => handleOptionClick('This Month')}>
            This Month
          </div>
        </div>
      )}
    </div>
  );
}
