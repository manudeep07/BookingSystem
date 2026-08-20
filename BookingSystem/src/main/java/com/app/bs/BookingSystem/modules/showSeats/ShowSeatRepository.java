package com.app.bs.BookingSystem.modules.showSeats;

import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.shows.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface ShowSeatRepository extends JpaRepository<ShowSeat, UUID> {
    ShowSeat findByShowAndSeat(Show show, Seat seat);   
    List<ShowSeat> findByShowAndSeatIn(Show show, List<Seat> seats);
    List<ShowSeat> findByShow(Show show);
    List<ShowSeat> findByShowAndSeatIdInAndSeatStatus(
        Show show,
        List<UUID> seatIds,
        ShowSeatStatus showSeatStatus
);
}
