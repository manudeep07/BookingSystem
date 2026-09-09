package com.app.bs.BookingSystem.modules.bookings.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.bookings.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponseDto {
    private UUID id;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime expiresAt;
}