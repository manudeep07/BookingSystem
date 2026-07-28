package com.app.bs.BookingSystem.modules.seats;

import com.app.bs.BookingSystem.modules.seats.DTO.CreateSeatRequestDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/seats")
public class SeatController {
    private SeatService seatService;
    public SeatController(SeatService seatService){
        this.seatService = seatService;
    }

    @PostMapping()
    public List<Seat> createSeats(@RequestBody CreateSeatRequestDTO createSeatRequestDTO){
        return seatService.createSeats(createSeatRequestDTO);
    }


}
