package com.app.bs.BookingSystem.modules.screens;

import com.app.bs.BookingSystem.modules.screens.DTO.CreateScreenRequestDTO;
import com.app.bs.BookingSystem.modules.screens.DTO.GetScreenRequestDTO;
import com.app.bs.BookingSystem.modules.theater.Theater;
import com.app.bs.BookingSystem.modules.theater.TheaterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreenService {
    private final ScreenRepository screenRepository;
    private final TheaterRepository theaterRepository;
    public ScreenService(ScreenRepository screenRepository,TheaterRepository theaterRepository){
        this.screenRepository = screenRepository;
        this.theaterRepository = theaterRepository;
    }

    public Screen createScreen(CreateScreenRequestDTO createScreenRequestDTO){
        Screen screenObj = mapToScreen(createScreenRequestDTO);

        screenObj = screenRepository.save(screenObj);
        return screenObj;
    }

    public List<Screen> getScreensByTheaterId(GetScreenRequestDTO getScreenRequestDTO){
        Theater theater = theaterRepository.findById(getScreenRequestDTO.getTheaterId())
                .orElseThrow((()-> new RuntimeException("Theater Id doesn't exists ")));
        return screenRepository.findAllByTheater(theater);
    }

    public Screen mapToScreen(CreateScreenRequestDTO createScreenRequestDTO){
        Screen screen = new Screen();
        screen.setScreenName(createScreenRequestDTO.getScreenName());
        Theater theater = theaterRepository.findById(createScreenRequestDTO.getTheaterId()).orElseThrow(()-> new RuntimeException("Theater not found"));
        screen.setTheater(theater);
        return screen;
    }

}
