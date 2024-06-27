import axios from 'axios';

const backendUrl = 'https://final-evaluation-pro-manage.onrender.com/api/v1/auth';

// Register User
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${backendUrl}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${backendUrl}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update User
export const updateUser = async (userId, name, email, oldPassword, newPassword) => {
  try {
    const response = await axios.patch(`${backendUrl}/update/${userId}`, {
      name,
      email,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add Person to addPeople

export const addPersonToUser = async (userId, person) => {
    try {
      const response = await axios.post(`${backendUrl}/${userId}/addPeople`, 
        {person}
    );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
};
  
  // Get All Items in addPeople
  export const getAddPeople = async (userId) => {
    try {
      const response = await axios.get(`${backendUrl}/${userId}/addPeople`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
};
