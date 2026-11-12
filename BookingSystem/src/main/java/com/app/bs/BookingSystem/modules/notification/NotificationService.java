package com.app.bs.BookingSystem.modules.notification;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.bookings.DTO.SeatInfo;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    public void sendPasswordResetEmail(
            String email,
            String token) {
        try {
            String link = "http://localhost:5173/reset-password?token="
                    + URLEncoder.encode(
                            token, StandardCharsets.UTF_8);

            String body = """
                    Hello,

                    We received a request to reset your password.

                    Click the link below:
                    %s

                    This link expires in 10 minutes.

                    If you did not request this, ignore this email.
                    """.formatted(link);

            emailService.sendEmail(
                    email,
                    "Password Reset Request",
                    body);
        } catch (MailException e) {
            log.error("Failed to send password reset email",
                    e);
        }
    }

    
    public void sendBookingConfirmation(
            String email,
            UUID bookingId,
            String movieName,
            List<SeatInfo> seatInfos,
            LocalDateTime showStartTime,
            String theaterName,
            String screenName,
            double totalAmount) throws MailException{

        
            String seats = seatInfos.stream()
                    .map(SeatInfo::name)
                    .collect(Collectors.joining(", "));

           DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a");

        String formattedShowTime = showStartTime.format(formatter);

        String body = """
                Your booking has been confirmed!

                Booking ID: %s

                Movie: %s

                Theater: %s

                Screen: %s

                Seats: %s

                Show Time: %s

                Total Amount: ₹%.2f

                Thank you for choosing us.
                """.formatted(
                bookingId,
                movieName,
                theaterName,
                screenName,
                seats,
                formattedShowTime,
                totalAmount
        );

            emailService.sendEmail(
                    email,
                    "Booking Confirmation",
                    body);

    }
}