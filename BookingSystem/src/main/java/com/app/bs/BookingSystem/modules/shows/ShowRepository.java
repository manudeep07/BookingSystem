package com.app.bs.BookingSystem.modules.shows;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShowRepository extends JpaRepository<Show, UUID> {
    // Show findByShow(Show show);
}
