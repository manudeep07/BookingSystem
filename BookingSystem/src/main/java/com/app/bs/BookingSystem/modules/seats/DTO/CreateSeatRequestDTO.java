package com.app.bs.BookingSystem.modules.seats.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateSeatRequestDTO {
    @NotNull(message = "Screen_id cannot be null")
    private UUID screen_id;
}
