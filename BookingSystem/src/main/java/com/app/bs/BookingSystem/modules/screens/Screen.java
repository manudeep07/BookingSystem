package com.app.bs.BookingSystem.modules.screens;

import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.shows.Show;
import com.app.bs.BookingSystem.modules.theater.Theater;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "screens")
@Entity
public class Screen {
    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank(message = "Screen name cannot be empty")
    private String screenName;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "theater_id")
    private Theater theater;

    @OneToMany(mappedBy = "screen")
    private List<Show> shows;

    @OneToMany(mappedBy = "screen")
    private List<Seat> seats;
}
