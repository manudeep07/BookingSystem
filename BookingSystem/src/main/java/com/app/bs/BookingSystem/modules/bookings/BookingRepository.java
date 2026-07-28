package com.app.bs.BookingSystem.modules.bookings;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime time);
}
