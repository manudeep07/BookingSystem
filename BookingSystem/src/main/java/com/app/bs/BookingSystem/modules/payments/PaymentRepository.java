package com.app.bs.BookingSystem.modules.payments;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.bs.BookingSystem.modules.bookings.Booking;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Payment findByRazorPayOrderId(String razorPayOrderId);
    Payment findByBooking(Booking booking);
}
