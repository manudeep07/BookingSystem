import apiClient from './client';

export const getSeatsByScreen = async (screenId) => {
  const response = await apiClient.get(`/seats/${screenId}`);
  return response.data; // Array<{ id: UUID, name: string, category: string }>
};

/**
 * createSeats payload:
 * {
 *   screen_id: UUID,
 *   seatCategories: [
 *     {
 *       category: string,
 *       pair: [
 *         { rows: number, cols: number }
 *       ]
 *     }
 *   ]
 * }
 */
export const createSeats = async (seatPayload) => {
  const response = await apiClient.post('/seats', seatPayload);
  return response.data;
};
