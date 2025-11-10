import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { jwtDecode } from 'jwt-decode';

export const checkTokenValidity = () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // seconds me

    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};
