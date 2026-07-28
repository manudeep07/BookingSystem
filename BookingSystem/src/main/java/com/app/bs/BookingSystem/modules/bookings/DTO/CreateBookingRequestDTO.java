package com.app.bs.BookingSystem.modules.bookings.DTO;

import jakarta.validation.constraints.NotNull;
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
public class CreateBookingRequestDTO {
    @NotNull(message = "Show id cannot be Null")
    private UUID showId;
    @NotNull(message = "seatIds cannot be Null")
    private List<UUID> seatIds;
}
