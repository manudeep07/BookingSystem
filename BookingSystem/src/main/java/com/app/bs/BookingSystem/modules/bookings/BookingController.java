package com.app.bs.BookingSystem.modules.bookings;


import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.bookings.DTO.CancelBookingRequestDTO;
import com.app.bs.BookingSystem.modules.bookings.DTO.CreateBookingRequestDTO;
import com.app.bs.BookingSystem.modules.payments.DTO.CreateOrderResponseDto;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final BookingService bookingService;
    public BookingController(BookingService bookingService){
        this.bookingService = bookingService;
    }
    @PostMapping()
    public  CreateOrderResponseDto createBooking(@RequestBody CreateBookingRequestDTO createBookingRequestDTO){
        return bookingService.createBooking(createBookingRequestDTO);
    }

    @PostMapping("/cancel")
    public Booking cancelBooking(@RequestBody CancelBookingRequestDTO cancelBookingRequestDTO ) {
       
        return bookingService.cancelBooking(cancelBookingRequestDTO);
    }
    

}
