package com.app.bs.BookingSystem.modules.bookings.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.app.bs.BookingSystem.modules.bookings.BookingStatus;
import com.app.bs.BookingSystem.modules.seats.Seat;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter 
public class MyBookingDto {

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    LocalDateTime startTime;

    LocalDateTime endTime;

    private  String screenName;

    private String theaterName;
    
    private String movieName;

    private String language;

    private List<Seat> seats;

    @Column(nullable = false, precision = 10, scale = 2, name = "total_amount")
    private BigDecimal totalAmount;
}
