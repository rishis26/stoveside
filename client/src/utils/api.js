import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
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
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Recipe API
export const recipeAPI = {
  getAll: (params = {}) => api.get('/recipes', { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (recipeData) => api.post('/recipes', recipeData),
  update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  delete: (id) => api.delete(`/recipes/${id}`),
  getUserRecipes: () => api.get('/recipes/user/my-recipes'),
};

// TODO: Add functions for MongoDB/local storage

export const mealDBAPI = {
  // Search meals by name (title or ingredient)
  searchByName: async (name) => {
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    return res.json();
  },
  // Filter by category (cuisine)
  filterByCategory: async (category) => {
    const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    return res.json();
  },
  // Get a random meal
  getRandom: async () => {
    const res = await fetch(`${BASE_URL}/random.php`);
    return res.json();
  },
  // List all categories
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories.php`);
    return res.json();
  },
};

export default api; 