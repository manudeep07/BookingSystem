package com.app.bs.BookingSystem.modules.showSeats;

import com.app.bs.BookingSystem.modules.screens.Screen;
import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.seats.SeatRepository;
import com.app.bs.BookingSystem.modules.shows.Show;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowSeatService {
    private final SeatRepository seatRepository;
    private final ShowSeatRepository showSeatRepository;

    public ShowSeatService(SeatRepository seatRepository, ShowSeatRepository showSeatRepository){
        this.seatRepository = seatRepository;
        this.showSeatRepository = showSeatRepository;
    }
    public void createShowSeats(Show show , Screen screen){
        List<Seat> seats = seatRepository.findAllByScreen(screen);
        for(Seat seat : seats){
            ShowSeat showSeat = new ShowSeat();
            showSeat.setShow(show);
            showSeat.setSeat(seat);
            showSeatRepository.save(showSeat);
        }

    }
}
