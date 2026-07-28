package com.app.bs.BookingSystem.modules.shows;

import com.app.bs.BookingSystem.modules.bookings.Booking;
import com.app.bs.BookingSystem.modules.languages.Language;
import com.app.bs.BookingSystem.modules.movies.Movie;
import com.app.bs.BookingSystem.modules.screens.Screen;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "shows")
public class Show {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "screen_id")
    @JsonIgnore
    private Screen screen;

    @ManyToOne
    @JoinColumn(name = "language_id")
    @JsonIgnore
    private Language language;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "show")
    private List<Booking> bookings;
}
