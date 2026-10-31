import apiClient from './client';

/**
 * createShow payload:
 * {
 *   movie_id: UUID,
 *   screen_id: UUID,
 *   language_id: UUID,
 *   startTime: string (ISO),
 *   endTime: string (ISO),
 *   categoryToPrices: { [category: string]: number }
 * }
 */
export const createShow = async (showPayload) => {
  const response = await apiClient.post('/shows', showPayload);
  return response.data;
};

/**
 * getShowSeats returns live seat status for a show:
 * Array<{
 *   id: UUID,
 *   price: number,
 *   seatStatus: 'AVAILABLE' | 'RESERVED' | 'BOOKED',
 *   version: number,
 *   seat: { id: UUID, name: string, category: string },
 *   show: { id: UUID, startTime: string, endTime: string }
 * }>
 */
export const getShowSeats = async (showId) => {
  const response = await apiClient.get(`/showSeats/${showId}`);
  return response.data;
};
