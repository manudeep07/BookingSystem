package com.app.bs.BookingSystem.modules.seats;

import com.app.bs.BookingSystem.modules.screens.Screen;
import com.app.bs.BookingSystem.modules.screens.ScreenRepository;
import com.app.bs.BookingSystem.modules.seats.DTO.CreateSeatRequestDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SeatService {
    private SeatRepository seatRepository;
    private ScreenRepository screenRepository;
    public SeatService(SeatRepository seatRepository,ScreenRepository screenRepository){
        this.seatRepository = seatRepository;
        this.screenRepository = screenRepository;
    }

    public List<Seat> createSeats(CreateSeatRequestDTO createSeatRequestDTO){

        Screen screen = screenRepository.findById(createSeatRequestDTO.getScreen_id()).orElseThrow(()->new RuntimeException("Screen doesn't exist"));
        List<Seat> seats = new ArrayList<>();
        for(char i = 'A' ; i <= 'J'; i++){
            for(int j = 1 ;j <= 10 ;j++){
                Seat seat = new Seat();

                StringBuilder sb = new StringBuilder();
                sb.append(i);
                sb.append("-");
                sb.append(j);
                seat.setName(sb.toString());
                seat.setScreen(screen);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
        return seatRepository.findByScreenId(screen.getId());
    }

    public List<Seat> getSeatsByScreenId(UUID screenId){
        return seatRepository.findByScreenId(screenId);
    }

}
