package com.app.bs.BookingSystem.modules.seats;

import com.app.bs.BookingSystem.modules.screens.Screen;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "seats")

public class Seat {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private  String category;
    @ManyToOne
    @JoinColumn(name = "screen_id")
    @JsonIgnore
    private Screen screen;

}
