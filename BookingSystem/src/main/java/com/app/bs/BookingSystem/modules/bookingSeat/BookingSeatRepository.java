package com.app.bs.BookingSystem.modules.bookingSeat;

import com.app.bs.BookingSystem.modules.bookings.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, UUID> {
    List<BookingSeat> findByBooking(Booking booking);
    List<BookingSeat> findByBookingIn(List<Booking> bookings);
}
