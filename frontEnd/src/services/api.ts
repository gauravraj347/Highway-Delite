import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://highway-delite-82x8.onrender.com/api';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://highway-delite-82x8.onrender.com/api'
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; dateOfBirth: string }) =>
    api.post('/auth/register', data),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),

  resendOTP: (data: { email: string }) =>
    api.post('/auth/resend-otp', data),

  requestLoginOTP: (data: { email: string }) =>
    api.post('/auth/request-login-otp', data),

  login: (data: { email: string; otp: string }) =>
    api.post('/auth/login', data),

  getMe: () =>
    api.get('/auth/me'),
};

// Notes API
export const notesAPI = {
  createNote: (data: { title: string }) =>
    api.post('/notes', data),

  deleteNote: (id: string) =>
    api.delete(`/notes/${id}`),
};

