import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (email, password, firstName, lastName) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, firstName, lastName }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
  }
};

export const getNotes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notes`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error retrieving notes:', error.response ? error.response.data : error.message);
  }
};

export const addNote = async (content) => {
  try {
    const response = await axios.post(`${API_URL}/notes`, { content }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error adding note:', error.response ? error.response.data : error.message);
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await axios.delete(`${API_URL}/notes/${noteId}`, { withCredentials: true });
    return response;
  } catch (error) {
    console.error('Error deleting note:', error.response ? error.response.data : error.message);
  }
};
