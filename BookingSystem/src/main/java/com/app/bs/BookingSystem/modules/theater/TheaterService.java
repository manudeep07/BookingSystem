package com.app.bs.BookingSystem.modules.theater;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheaterService {
    private final TheaterRepository theaterRepository;

    public TheaterService(TheaterRepository theaterRepository){
        this.theaterRepository = theaterRepository;

    }

    public Theater createTheater(Theater theater){
        return theaterRepository.save(theater);
    }
    public List<Theater> getTheaters(){
        return theaterRepository.findAll();
    }
}
