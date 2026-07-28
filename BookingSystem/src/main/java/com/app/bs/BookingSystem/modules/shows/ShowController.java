package com.app.bs.BookingSystem.modules.shows;

import com.app.bs.BookingSystem.modules.shows.DTO.CreateShowRequestDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
