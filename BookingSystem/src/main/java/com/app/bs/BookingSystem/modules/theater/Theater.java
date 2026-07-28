package com.app.bs.BookingSystem.modules.theater;

import com.app.bs.BookingSystem.modules.screens.Screen;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "theaters")
public class Theater{
    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @OneToMany(mappedBy = "theater")
    private List<Screen> screens;

}
