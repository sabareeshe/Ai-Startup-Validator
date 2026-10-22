// ============================================================
// services/api.js — Axios Instance & API Service
// ============================================================

import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60s timeout for AI requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    // Handle 401 - Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
