import axiosClient from '../config/axios';

export const getCommentsByEmployee = (employeeId) =>
  axiosClient.get(`/api/comments/employee/${employeeId}`);

export const addComment = (data) =>
  axiosClient.post('/api/comments', data); 