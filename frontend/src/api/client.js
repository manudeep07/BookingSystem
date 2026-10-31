import axios from 'axios';

// Vite proxy forwards endpoints like /auth, /movies, /bookings etc. to http://localhost:8080
export const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch backend errors & handle auth expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const url = error.config ? error.config.url : '';

    // Extract exact backend error message from GlobalExceptionHandler ErrorResponse shape
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    error.backendMessage = backendMessage;

    // Handle 401/403: Auto redirect to login (skip during probe requests or auth endpoints)
    if (
      (status === 401 || status === 403) &&
      !url.includes('/auth/login') &&
      !url.includes('/users') &&
      !error.config?.skipAuthRedirect
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
