package com.app.bs.BookingSystem.modules.theater;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/theaters")
public class TheaterController {
    private final TheaterService theaterService;

    public TheaterController(TheaterService theaterService){
        this.theaterService = theaterService;
    }

    @PostMapping
    Theater createTheater(@RequestBody Theater theater){
        Theater response = theaterService.createTheater(theater);
        return response;
    }
    @GetMapping
    List<Theater> getTheaters(){
        List<Theater> response = theaterService.getTheaters();
        return response;
    }
}
