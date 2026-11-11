package com.app.bs.BookingSystem.modules.notification;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendPasswordResetEmail(
            String email,
            String token) {

        String link =
            "http://localhost:5173/reset-password?token="
            + URLEncoder.encode(
                token, StandardCharsets.UTF_8
            );

        String body = """
                Hello,

                We received a request to reset your password.

                Click the link below:
                %s

                This link expires in 15 minutes.

                If you did not request this, ignore this email.
                """.formatted(link);

        emailService.sendEmail(
            email,
            "Password Reset Request",
            body
        );
    }

    public void sendBookingConfirmation(
            String email,
            Long bookingId) {

        String body = """
                Your booking has been confirmed!

                Booking ID: %d

                Thank you for choosing us.
                """.formatted(bookingId);

        emailService.sendEmail(
            email,
            "Booking Confirmation",
            body
        );
    }
}