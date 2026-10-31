import apiClient from './client';

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data; // { token: string }
};

export const register = async (name, email, password) => {
  const response = await apiClient.post('/users', { name, email, password });
  return response.data; // { name: string, email: string }
};

export const getUsers = async (options = {}) => {
  const response = await apiClient.get('/users', options);
  return response.data; // Array<{ name: string, email: string }>
};

/**
 * Probe whether current user has ADMIN privileges.
 * Since backend protects /users (or admin actions) with ADMIN role,
 * a successful 200 means ADMIN; a 403 means CUSTOMER.
 */
export const probeRole = async () => {
  try {
    await apiClient.get('/users', { skipAuthRedirect: true });
    return 'ADMIN';
  } catch (err) {
    if (err.response?.status === 403) {
      return 'CUSTOMER';
    }
    // If 401, token is invalid/expired
    if (err.response?.status === 401) {
      throw err;
    }
    // Fallback to CUSTOMER
    return 'CUSTOMER';
  }
};
