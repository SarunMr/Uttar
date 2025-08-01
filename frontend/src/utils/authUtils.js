
import axios from 'axios';

// Setup axios interceptor for automatic logout on 401/403
export const setupAuthInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );
};

// Call this in your main App.jsx
export const initializeAuth = () => {
  setupAuthInterceptor();
};
