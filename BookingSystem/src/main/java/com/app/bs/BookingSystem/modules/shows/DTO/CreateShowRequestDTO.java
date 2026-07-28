package com.app.bs.BookingSystem.modules.shows.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateShowRequestDTO {
    @NotNull(message = "Movie id cannot be null")
    private UUID movie_id;

    @NotNull(message = "Screen id cannot be null")
    private UUID screen_id;

    @NotNull(message = "language id cannot be null")
    private UUID language_id;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;


}
