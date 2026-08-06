package com.app.bs.BookingSystem.modules.showSeats;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/showSeats")
public class ShowSeatController {
    private ShowSeatService showSeatService;

    public ShowSeatController(ShowSeatService showSeatService){
        this.showSeatService = showSeatService;
    }

    @GetMapping("/{showId}")
    public List<ShowSeat> getShowSeatByShowId(@PathVariable UUID showId){
        return showSeatService.getShowSeatByShowId(showId);
    }

}
