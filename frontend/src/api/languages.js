import apiClient from './client';

export const getLanguages = async () => {
  const response = await apiClient.get('/languages');
  return response.data;
};

export const createLanguage = async (name) => {
  const response = await apiClient.post('/languages', { name });
  return response.data;
};
