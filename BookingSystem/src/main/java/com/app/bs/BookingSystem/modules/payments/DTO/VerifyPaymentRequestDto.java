package com.app.bs.BookingSystem.modules.payments.DTO;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyPaymentRequestDto {
     private UUID bookingId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}
