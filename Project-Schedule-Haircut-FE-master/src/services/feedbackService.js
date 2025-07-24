import axiosClient from '../config/axios';

export const addFeedback = (data) =>
  axiosClient.post('/api/feedback', data);

export const getFeedbackByCustomer = (customerId) =>
  axiosClient.get(`/api/feedback/${customerId}`); 