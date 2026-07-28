package com.app.bs.BookingSystem.modules.theater;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
