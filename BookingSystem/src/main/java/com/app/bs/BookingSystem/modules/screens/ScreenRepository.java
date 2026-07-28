package com.app.bs.BookingSystem.modules.screens;
import com.app.bs.BookingSystem.modules.theater.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, UUID> {
    List<Screen> findAllByTheater(Theater theater);
}
