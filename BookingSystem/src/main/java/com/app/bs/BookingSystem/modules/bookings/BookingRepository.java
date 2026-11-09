package com.app.bs.BookingSystem.modules.bookings;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.query.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.bs.BookingSystem.modules.user.User;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime time);

    @EntityGraph(attributePaths = {
            "show.movie",
            "show.screen.theater",
            "show.language"
    })
    List<Booking> findByUserAndStatusIn(
            User user,
            List<BookingStatus> statuses
    );
}
