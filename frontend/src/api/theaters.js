import apiClient from './client';

export const getTheaters = async () => {
  const response = await apiClient.get('/theaters');
  return response.data;
};

export const createTheater = async (theaterData) => {
  const response = await apiClient.post('/theaters', theaterData);
  return response.data;
};

export const getScreens = async (theaterId) => {
  // Pass both in path and query param to accommodate Spring MVC binding
  const response = await apiClient.get(`/screens/${theaterId}`, {
    params: { theaterId },
  });
  return response.data;
};

export const createScreen = async (screenData) => {
  // screenData: { screenName: string, theaterId: string (UUID) }
  const response = await apiClient.post('/screens', screenData);
  return response.data;
};
