package com.app.bs.BookingSystem.modules.languages;

import com.app.bs.BookingSystem.modules.shows.Show;
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
@Table(name = "languages")

public class Language {
    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank(message="show cannot be empty")
    String name;

    @OneToMany(mappedBy = "language")
    private List<Show> shows;

}
