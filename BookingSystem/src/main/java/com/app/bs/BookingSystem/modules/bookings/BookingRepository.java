package com.app.bs.BookingSystem.modules.bookings;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.bs.BookingSystem.modules.user.User;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime time);
    List<Booking> findByUser(User user);
}
