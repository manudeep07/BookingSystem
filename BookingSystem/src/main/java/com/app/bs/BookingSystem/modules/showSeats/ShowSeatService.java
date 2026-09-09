package com.app.bs.BookingSystem.modules.showSeats;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.screens.Screen;
import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.seats.SeatRepository;
import com.app.bs.BookingSystem.modules.shows.Show;
import com.app.bs.BookingSystem.modules.shows.ShowRepository;

@Service
public class ShowSeatService {
    private final SeatRepository seatRepository;
    private final ShowSeatRepository showSeatRepository;
    private final ShowRepository showRepository;

    public ShowSeatService(SeatRepository seatRepository, ShowSeatRepository showSeatRepository,
            ShowRepository showRepository) {
        this.seatRepository = seatRepository;
        this.showSeatRepository = showSeatRepository;
        this.showRepository = showRepository;
    }

    public void createShowSeats(Show show, Screen screen, Map<String, BigDecimal> categoryToPrices) {
        List<Seat> seats = seatRepository.findByScreenId(screen.getId());
        List<ShowSeat> showSeats = new ArrayList<>();

        for (Seat seat : seats) {
            BigDecimal price = categoryToPrices.get(seat.getCategory());
            if (price == null) {
                throw new RuntimeException("No price provided for category: " + seat.getCategory());
            }

            ShowSeat showSeat = new ShowSeat();
            showSeat.setSeat(seat);
            showSeat.setShow(show);
            showSeat.setPrice(price);
            showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
            showSeats.add(showSeat);
        }

        showSeatRepository.saveAll(showSeats);
    }

    public List<ShowSeat> getShowSeatByShowId(UUID showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show id cannot be empty"));
        List<ShowSeat> showSeats = showSeatRepository.findByShow(show);
        return showSeats;
    }
}
