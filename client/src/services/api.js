import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mentorpet.onrender.com/api/v1',
  withCredentials: true
});

// Add interceptor to include token in requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., token expired)
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getMe = () => API.get('/auth/me');
export const getDashboardStats = () => API.get('/tasks/stats');
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}`);
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export default API;
