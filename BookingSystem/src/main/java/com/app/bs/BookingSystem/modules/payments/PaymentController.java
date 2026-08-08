package com.app.bs.BookingSystem.modules.payments;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.bookings.BookingService;
import com.app.bs.BookingSystem.modules.payments.DTO.VerifyPaymentRequestDto;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

   private final PaymentService paymentService;
   private final BookingService bookingService;
   
   @PostMapping("/verify")
   public boolean verifyPayment(@RequestBody VerifyPaymentRequestDto verifyPaymentRequestDto) {
       boolean signatureIsValid = paymentService.verifyPayment(verifyPaymentRequestDto);
       if(signatureIsValid){
        bookingService.confirmBooking(verifyPaymentRequestDto.getBookingId());
       }
      return signatureIsValid;
   }
   
    
}
