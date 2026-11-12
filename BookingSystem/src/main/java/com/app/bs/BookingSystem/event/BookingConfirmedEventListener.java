package com.app.bs.BookingSystem.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.app.bs.BookingSystem.modules.notification.NotificationService;

@Component
public class BookingConfirmedEventListener {

    private static final Logger log =
            LoggerFactory.getLogger(
                    BookingConfirmedEventListener.class
            );

    private final NotificationService notificationService;

    public BookingConfirmedEventListener(
            NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleBookingConfirmed(
            BookingConfirmedEvent event) {

        try {
            notificationService.sendBookingConfirmation(
                    event.email(),
                    event.bookingId(),
                    event.movieName(),
                    event.seatInfos(),
                    event.showStartTime(),
                    event.theaterName(),
                    event.screenName(),
                    event.totalAmount()
            );

        } catch (MailException e) {
            log.error(
                    "Failed to send confirmation email for booking {}",
                    event.bookingId(),
                    e
            );
        }
    }
}
