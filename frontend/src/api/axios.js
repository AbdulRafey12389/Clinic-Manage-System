import axios from 'axios';
import { redirect } from 'react-router-dom';

const API = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:5000/api/v1'
      : import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      redirect('/login');
    }
    return Promise.reject(error);
  },
);

export default API;
