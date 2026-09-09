package com.app.bs.BookingSystem.modules.bookings;


import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.bookings.DTO.BookingResponseDto;
import com.app.bs.BookingSystem.modules.bookings.DTO.CancelBookingRequestDTO;
import com.app.bs.BookingSystem.modules.bookings.DTO.CreateBookingRequestDTO;
import com.app.bs.BookingSystem.modules.payments.DTO.CreateOrderResponseDto;
import com.app.bs.BookingSystem.modules.user.CustomUserDetails;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final BookingService bookingService;
    public BookingController(BookingService bookingService){
        this.bookingService = bookingService;
    }
    @PostMapping()
    public  CreateOrderResponseDto createBooking(@RequestBody CreateBookingRequestDTO createBookingRequestDTO,
         @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        return bookingService.createBooking(createBookingRequestDTO,userDetails.getUser());
    }

    @PostMapping("/cancel")
    public BookingResponseDto cancelBooking(@RequestBody CancelBookingRequestDTO cancelBookingRequestDTO,
        @AuthenticationPrincipal CustomUserDetails userDetails
     ) {
       
        return bookingService.cancelBooking(cancelBookingRequestDTO,userDetails.getUser());
    }
    

}
