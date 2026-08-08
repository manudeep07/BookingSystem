package com.app.bs.BookingSystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Configuration
public class RazorPayConfig {

    @Bean
    public RazorpayClient razorpayClient(RazorPayProperties properties)
            throws RazorpayException {

        return new RazorpayClient(
                properties.getKeyId(),
                properties.getKeySecret());
    }
}
