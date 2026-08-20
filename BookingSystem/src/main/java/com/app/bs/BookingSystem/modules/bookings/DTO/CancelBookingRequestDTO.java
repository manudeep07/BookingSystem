package com.app.bs.BookingSystem.modules.bookings.DTO;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CancelBookingRequestDTO {
    @NotNull(message = "BookingId cannot be null")
    private UUID bookingId;
}
