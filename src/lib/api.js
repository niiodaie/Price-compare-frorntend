import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // Use relative path in production
    : 'http://localhost:5001/api',  // Use full URL in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Entries
  getEntries: (params = {}) => api.get('/entries', { params }),
  getEntry: (id) => api.get(`/entries/${id}`),
  createEntry: (data) => api.post('/entries', data),
  updateEntry: (id, data) => api.put(`/entries/${id}`, data),
  deleteEntry: (id) => api.delete(`/entries/${id}`),

  // Admin
  getPendingEntries: () => api.get('/admin/entries/pending'),
  approveEntry: (id) => api.post(`/admin/entries/${id}/approve`),

  // Categories
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),

  // Currency
  getCurrencies: () => api.get('/currencies'),
  convertCurrency: (data) => api.post('/currencies/convert', data),

  // Location
  getLocation: () => api.get('/location'),
  getCountries: () => api.get('/countries'),

  // Health
  healthCheck: () => api.get('/health'),
};

export default api;

