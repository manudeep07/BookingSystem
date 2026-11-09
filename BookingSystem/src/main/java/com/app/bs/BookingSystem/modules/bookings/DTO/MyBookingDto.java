package com.app.bs.BookingSystem.modules.bookings.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.bookings.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter 
public class MyBookingDto {

    private UUID bookingId;

    private BookingStatus status;

    LocalDateTime startTime;

    LocalDateTime endTime;

    private  String screenName;

    private String theaterName;
    
    private String movieName;

    private String language;

    private List<SeatInfo> seats;

    private BigDecimal totalAmount;
}
