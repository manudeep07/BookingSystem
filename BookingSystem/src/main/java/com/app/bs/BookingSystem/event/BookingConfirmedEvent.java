package com.app.bs.BookingSystem.event;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.bookings.DTO.SeatInfo;

public record BookingConfirmedEvent(
        String email,
        UUID bookingId,
        String movieName,
        List<SeatInfo> seatInfos,
        LocalDateTime showStartTime,
        String theaterName,
        String screenName,
        double totalAmount
) {
    public BookingConfirmedEvent {
        seatInfos = List.copyOf(seatInfos);
    }
}