package com.app.bs.BookingSystem.modules.shows;

import com.app.bs.BookingSystem.modules.languages.Language;
import com.app.bs.BookingSystem.modules.languages.LanguageRepository;
import com.app.bs.BookingSystem.modules.movies.Movie;
import com.app.bs.BookingSystem.modules.movies.MovieRepository;
import com.app.bs.BookingSystem.modules.screens.Screen;
import com.app.bs.BookingSystem.modules.screens.ScreenRepository;
import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.seats.SeatRepository;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeat;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeatService;
import com.app.bs.BookingSystem.modules.shows.DTO.CreateShowRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final LanguageRepository languageRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowSeatService showSeatService;
    public ShowService(ShowRepository showRepository,
                       MovieRepository movieRepository,
                       LanguageRepository languageRepository,
                       ScreenRepository screenRepository,
                       SeatRepository seatRepository,
                       ShowSeatService showSeatService
    )
    {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.languageRepository = languageRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showSeatService = showSeatService;
    }

    public Show createShow(CreateShowRequestDTO createShowRequestDTO){
        Show showCreated = mapToShow(createShowRequestDTO);
        showCreated = showRepository.save(showCreated);
        Screen screen = screenRepository.findById(createShowRequestDTO.getScreen_id())
                .orElseThrow(()->new RuntimeException("Screen doesn't exist"));

        showSeatService.createShowSeats(showCreated,screen);
        return showCreated;
    }

    public Show mapToShow(CreateShowRequestDTO createShowRequestDTO){
        Movie movie = movieRepository.findById(createShowRequestDTO.getMovie_id()).orElseThrow(()->new RuntimeException("Movie doesn't exists"));
        Language language = languageRepository.findById(createShowRequestDTO.getLanguage_id()).orElseThrow(()->new RuntimeException("Language doesn't exists"));
        Screen screen = screenRepository.findById(createShowRequestDTO.getScreen_id()).orElseThrow(()->new RuntimeException("Screen doesn't exist"));
        Show show = new Show();
        show.setMovie(movie);
        show.setScreen(screen);
        show.setLanguage(language);
        show.setStartTime(createShowRequestDTO.getStartTime());
        show.setEndTime(createShowRequestDTO.getEndTime());
        return show;
    }
}
