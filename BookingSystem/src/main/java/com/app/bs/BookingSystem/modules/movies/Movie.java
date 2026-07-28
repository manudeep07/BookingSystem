package com.app.bs.BookingSystem.modules.movies;

import com.app.bs.BookingSystem.modules.shows.Show;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue
    private UUID id;
    @NotBlank(message = "Movie name Cannot be empty")
    private String name;
    private String imgSource;

    @OneToMany(mappedBy = "movie")
    private List<Show> shows;
}
