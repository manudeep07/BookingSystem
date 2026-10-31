package com.app.bs.BookingSystem.modules.shows;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.shows.DTO.CreateShowRequestDTO;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/shows")
public class ShowController {
    private ShowService showService;
    public ShowController(ShowService showService){
        this.showService = showService;
    }

    @PostMapping()
    public Show createShow(@RequestBody CreateShowRequestDTO createShowRequestDTO){
        return showService.createShow(createShowRequestDTO);
    }

    @GetMapping("/{id}")
    public List<Show> getShowsByMovieId(@PathVariable UUID id) {
        return showService.getShowsByMovieId(id);
    }

    

}
