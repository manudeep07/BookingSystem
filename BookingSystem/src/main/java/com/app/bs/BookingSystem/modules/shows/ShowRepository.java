package com.app.bs.BookingSystem.modules.shows;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.bs.BookingSystem.modules.movies.Movie;

import java.util.List;
import java.util.UUID;

public interface ShowRepository extends JpaRepository<Show, UUID> {
    // Show findByShow(Show show);
    List<Show> findByMovie(Movie movie);
}
