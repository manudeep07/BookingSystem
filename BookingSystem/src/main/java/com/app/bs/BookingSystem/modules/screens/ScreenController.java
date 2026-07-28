package com.app.bs.BookingSystem.modules.screens;

import com.app.bs.BookingSystem.modules.screens.DTO.CreateScreenRequestDTO;
import com.app.bs.BookingSystem.modules.screens.DTO.GetScreenRequestDTO;
import com.app.bs.BookingSystem.modules.theater.Theater;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("screens")
public class ScreenController {
    private final ScreenService screenService;
    public ScreenController(ScreenService screenService){
        this.screenService = screenService;
    }

    @PostMapping
    public Screen createScreen(@RequestBody CreateScreenRequestDTO createScreenRequestDTO){
        Screen response = screenService.createScreen(createScreenRequestDTO);
        return response;
    }

    @GetMapping("/{theaterId}")
    public List<Screen> getScreensByTheaterId(GetScreenRequestDTO getRequestScreenDTO){
        return screenService.getScreensByTheaterId(getRequestScreenDTO);
    }
}
