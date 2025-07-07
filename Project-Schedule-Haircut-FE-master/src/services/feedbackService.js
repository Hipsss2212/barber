import axios from 'axios';
const API_URL = 'http://localhost:8080/api/comments';

export const getCommentsByEmployee = (employeeId) =>
  axios.get(`${API_URL}/employee/${employeeId}`);

export const addComment = (data) =>
  axios.post(`${API_URL}/`, data); 