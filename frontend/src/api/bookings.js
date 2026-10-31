import apiClient from './client';

/**
 * createBooking payload:
 * {
 *   showId: UUID,
 *   seatIds: Array<UUID> // Note: seat.id of each seat!
 * }
 * Response: { bookingId: UUID, orderId: string, amount: number (paise), keyId: string }
 */
export const createBooking = async (showId, seatIds) => {
  const response = await apiClient.post('/bookings', { showId, seatIds });
  return response.data;
};

/**
 * cancelBooking payload: { bookingId: UUID }
 * Response: { id: UUID, status: 'CANCELLED', totalAmount: number, expiresAt: string }
 */
export const cancelBooking = async (bookingId) => {
  const response = await apiClient.post('/bookings/cancel', { bookingId });
  return response.data;
};

/**
 * verifyPayment payload:
 * {
 *   bookingId: UUID,
 *   razorpayOrderId: string,
 *   razorpayPaymentId: string,
 *   razorpaySignature: string
 * }
 * Response: boolean (true on success)
 */
export const verifyPayment = async (verificationPayload) => {
  const response = await apiClient.post('/payments/verify', verificationPayload);
  return response.data;
};
