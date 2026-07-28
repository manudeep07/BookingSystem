package com.app.bs.BookingSystem.modules.movies;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    public MovieService(MovieRepository movieRepository){
        this.movieRepository = movieRepository;
    }

    public Movie createMovie(Movie movie){
        return movieRepository.save(movie);
    }
    public List<Movie> getMovies(){
        return movieRepository.findAll();
    }

}
