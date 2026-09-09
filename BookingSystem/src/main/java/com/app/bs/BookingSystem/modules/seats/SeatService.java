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
        List<SeatCategory> seatCategories = createSeatRequestDTO.getSeatCategories();
        String seatPrefix = "A";
        for (int i = 0; i < seatCategories.size(); i++) {
            SeatCategory seatCategory = seatCategories.get(i);
            String category = seatCategory.getCategory();
            List<Pair> pairs = seatCategory.getPair();
            for (int j = 0; j < pairs.size(); j++) {
                int rows = pairs.get(j).getRows();
                int cols = pairs.get(j).getCols();
                for (int k = 1; k <= rows; k++) {
                    for (int l = 1; k <= cols; l++) {
                        Seat seat = new Seat();
                        StringBuilder seatName = new StringBuilder();
                        seatName.append(seatPrefix);
                        seatName.append(l);
                        seat.setCategory(category);
                        seat.setName(seatName.toString());
                        seat.setScreen(screen);
                        seatPrefix = updateSeatPrefix(seatPrefix);
                    }
                }
            }

        }
        seatRepository.saveAll(seats);
        return seatRepository.findByScreenId(screen.getId());
    }

    public List<Seat> getSeatsByScreenId(UUID screenId) {
        return seatRepository.findByScreenId(screenId);
    }

    public String updateSeatPrefix(String oldPrefix) {
        StringBuilder newPrefix = new StringBuilder(oldPrefix);
        for (int i = oldPrefix.length(); i >= 0; i--) {
            char ch = oldPrefix.charAt(i);
            if (ch != 'Z') {
                int idx = ch;
                idx++;
                ch = (char) idx;
                newPrefix.setCharAt(i, ch);
                break;
            }else{
                ch = 'A';
                newPrefix.setCharAt(i, ch);
                if(i == 0) newPrefix.append('A');
            }
        }
        return newPrefix.toString();
    }

}
