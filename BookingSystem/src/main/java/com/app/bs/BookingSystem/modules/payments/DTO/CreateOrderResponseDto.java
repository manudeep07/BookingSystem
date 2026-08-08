package com.app.bs.BookingSystem.modules.payments.DTO;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateOrderResponseDto {
        private UUID bookingId;
        private String orderId;
        private Integer amount;
        private String keyId;
}
