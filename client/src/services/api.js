import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Add interceptor to include token in requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getMe = () => API.get('/auth/me');
export const getDashboardStats = () => API.get('/tasks/stats');

export default API;
