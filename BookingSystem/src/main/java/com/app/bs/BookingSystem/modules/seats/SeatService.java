package com.app.bs.BookingSystem.modules.seats;

import com.app.bs.BookingSystem.modules.screens.Screen;
import com.app.bs.BookingSystem.modules.screens.ScreenRepository;
import com.app.bs.BookingSystem.modules.seats.DTO.CreateSeatRequestDTO;
import com.app.bs.BookingSystem.modules.seats.DTO.SeatCategory;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.seats.DTO.Pair;

@Service
public class SeatService {
    private SeatRepository seatRepository;
    private ScreenRepository screenRepository;

    public SeatService(SeatRepository seatRepository, ScreenRepository screenRepository) {
        this.seatRepository = seatRepository;
        this.screenRepository = screenRepository;
    }

    public List<Seat> createSeats(CreateSeatRequestDTO createSeatRequestDTO) {
        Screen screen = screenRepository.findById(createSeatRequestDTO.getScreen_id())
                .orElseThrow(() -> new RuntimeException("Screen doesn't exist"));

        List<Seat> seats = new ArrayList<>();
        String rowPrefix = "A";

        for (SeatCategory seatCategory : createSeatRequestDTO.getSeatCategories()) {
            String category = seatCategory.getCategory();

            for (Pair pair : seatCategory.getPair()) {
                int rows = pair.getRows();
                int cols = pair.getCols();

                for (int row = 1; row <= rows; row++) {
                    for (int col = 1; col <= cols; col++) {
                        Seat seat = new Seat();
                        seat.setName(rowPrefix + col);
                        seat.setCategory(category);
                        seat.setScreen(screen);
                        seats.add(seat);
                    }
                    rowPrefix = updateSeatPrefix(rowPrefix); 
                }
            }
        }

        seatRepository.saveAll(seats);
        return seatRepository.findByScreenId(screen.getId());
    }

    public String updateSeatPrefix(String oldPrefix) {
        StringBuilder newPrefix = new StringBuilder(oldPrefix);
        for (int i = oldPrefix.length() - 1; i >= 0; i--) {
            char ch = oldPrefix.charAt(i);
            if (ch != 'Z') {
                newPrefix.setCharAt(i, (char) (ch + 1));
                return newPrefix.toString();
            } else {
                newPrefix.setCharAt(i, 'A');
                if (i == 0)
                    newPrefix.append('A');
            }
        }
        return newPrefix.toString();
    }

    public List<Seat> getSeatsByScreenId(UUID screenId) {
        return seatRepository.findByScreenId(screenId);
    }
}
