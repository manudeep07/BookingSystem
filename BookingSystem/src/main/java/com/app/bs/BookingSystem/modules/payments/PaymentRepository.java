package com.app.bs.BookingSystem.modules.payments;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Payment findByRazorPayOrderId(String razorPayOrderId);
}
