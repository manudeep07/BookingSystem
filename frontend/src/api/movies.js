import apiClient from './client';

export const getMovies = async () => {
  const response = await apiClient.get('/movies');
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await apiClient.post('/movies', movieData);
  return response.data;
};
