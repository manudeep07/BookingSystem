package com.app.bs.BookingSystem.modules.showSeats;

import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.shows.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShowSeatRepository extends JpaRepository<ShowSeat, UUID> {
    ShowSeat findByShowAndSeat(Show show, Seat seat);

}
