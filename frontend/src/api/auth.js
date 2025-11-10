// src/api/auth.js
import API from './axios';

export async function registerUser(formData) {
  try {
    const response = await API.post('auth/register', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
    };
  }
}

export async function loginUser(formData) {
  try {
    const response = await API.post('auth/login', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
}
