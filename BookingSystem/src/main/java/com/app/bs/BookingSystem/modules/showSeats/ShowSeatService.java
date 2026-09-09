package com.app.bs.BookingSystem.modules.showSeats;

import com.app.bs.BookingSystem.modules.screens.Screen;
import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.seats.SeatRepository;
import com.app.bs.BookingSystem.modules.shows.Show;
import com.app.bs.BookingSystem.modules.shows.ShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ShowSeatService {
    private final SeatRepository seatRepository;
    private final ShowSeatRepository showSeatRepository;
    private final ShowRepository showRepository;

    public ShowSeatService(SeatRepository seatRepository, ShowSeatRepository showSeatRepository, ShowRepository showRepository){
        this.seatRepository = seatRepository;
        this.showSeatRepository = showSeatRepository;
        this.showRepository = showRepository;
    }
    public void createShowSeats(Show show , Screen screen){
        List<Seat> seats = seatRepository.findByScreenId(screen.getId());
        List<String> categories = 

    }

    public List<ShowSeat> getShowSeatByShowId(UUID showId){
        Show show = showRepository.findById(showId)
                .orElseThrow(()-> new RuntimeException("Show id cannot be empty"));
        List<ShowSeat> showSeats = showSeatRepository.findByShow(show);
        return showSeats;
    }
}
