package com.app.bs.BookingSystem.modules.bookingSeat;

import com.app.bs.BookingSystem.modules.bookings.Booking;
import com.app.bs.BookingSystem.modules.seats.Seat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingSeat {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;
}
