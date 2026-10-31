import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cancelBooking as apiCancelBooking } from '../api/bookings';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  // Load bookings for current user from localStorage
  useEffect(() => {
    if (user?.email) {
      const storageKey = `cinepass_bookings_${user.email}`;
      const saved = localStorage.getItem(storageKey);
      setBookings(saved ? JSON.parse(saved) : []);
    } else {
      setBookings([]);
    }
  }, [user?.email]);

  const saveBookings = (newBookings) => {
    if (user?.email) {
      const storageKey = `cinepass_bookings_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(newBookings));
      setBookings(newBookings);
    }
  };

  const addBooking = (bookingRecord) => {
    const updated = [bookingRecord, ...bookings];
    saveBookings(updated);
  };

  const updateBookingStatus = (bookingId, status) => {
    const updated = bookings.map((b) =>
      b.bookingId === bookingId ? { ...b, status } : b
    );
    saveBookings(updated);
  };

  const cancelUserBooking = async (bookingId) => {
    const result = await apiCancelBooking(bookingId);
    updateBookingStatus(bookingId, result.status || 'CANCELLED');
    return result;
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        cancelUserBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
