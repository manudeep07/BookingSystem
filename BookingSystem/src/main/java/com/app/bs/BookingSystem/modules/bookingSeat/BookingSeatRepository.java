package com.app.bs.BookingSystem.modules.bookingSeat;

import com.app.bs.BookingSystem.modules.bookings.Booking;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, UUID> {
    @EntityGraph(attributePaths = { "seat" })
    List<BookingSeat> findByBooking(Booking booking);

    @EntityGraph(attributePaths = { "seat" })
    List<BookingSeat> findByBookingIn(List<Booking> bookings);
}
