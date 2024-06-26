// src/api/taskApi.js
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api/v1/task';

export const getTasksByUser = async (userId, email) => {
    try {
        const response = await axios.get(`${backendUrl}/user/${userId}`, {
          params: { email }, // Send email as a query parameter
        });
        return response.data;
      }catch (error) {
    throw error;
  }
};

export const createTask = async (taskData, token) => {
  try {
    const response = await axios.post(`${backendUrl}/create`, taskData, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id, taskData, token) => {
  try {
    const response = await axios.put(`${backendUrl}/update/${id}`, taskData, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await axios.delete(`${backendUrl}/delete/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
