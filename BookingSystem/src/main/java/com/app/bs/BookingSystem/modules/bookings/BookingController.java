package com.app.bs.BookingSystem.modules.bookings;

import com.app.bs.BookingSystem.modules.bookings.DTO.CreateBookingRequestDTO;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final BookingService bookingService;
    public BookingController(BookingService bookingService){
        this.bookingService = bookingService;
    }
    @PostMapping()
    public Booking createBooking(@RequestBody CreateBookingRequestDTO createBookingRequestDTO){
        return bookingService.createBooking(createBookingRequestDTO);
    }

    @PatchMapping("/{bookingId}/{status}")
    public Booking confirmBooking(@PathVariable UUID bookingId,@PathVariable String status){
        return bookingService.confirmBooking(bookingId,status);
    }
}
