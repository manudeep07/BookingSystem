package com.app.bs.BookingSystem.modules.movies;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {
    public final MovieService movieService;
    public MovieController(MovieService movieService){
        this.movieService = movieService;
    }
    @PostMapping()
    public Movie createMovie(@RequestBody Movie movie){
        Movie response = movieService.createMovie(movie);
        return response;
    }
    @GetMapping()
    public List<Movie> getMovies(){
        return movieService.getMovies();
    }


}
