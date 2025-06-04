import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'producer';
  profile?: any;
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const register = async (email: string, password: string, role: 'customer' | 'producer', profileData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    role,
    profileData
  });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 