package com.app.bs.BookingSystem.modules.bookings;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.bookingSeat.BookingSeat;
import com.app.bs.BookingSystem.modules.bookingSeat.BookingSeatRepository;
import com.app.bs.BookingSystem.modules.bookings.DTO.CreateBookingRequestDTO;
import com.app.bs.BookingSystem.modules.payments.PaymentService;
import com.app.bs.BookingSystem.modules.payments.DTO.CreateOrderResponseDto;
import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.seats.SeatRepository;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeat;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeatRepository;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeatStatus;
import com.app.bs.BookingSystem.modules.shows.Show;
import com.app.bs.BookingSystem.modules.shows.ShowRepository;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;

@Service
public class BookingService {
    private final PaymentService paymentService;
    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public BookingService(BookingRepository bookingRepository, ShowRepository showRepository,
            SeatRepository seatRepository, ShowSeatRepository showSeatRepository,
            BookingSeatRepository bookingSeatRepository, PaymentService paymentService) {
        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public CreateOrderResponseDto createBooking(CreateBookingRequestDTO createBookingRequestDTO) {
        Show show = showRepository.findById(createBookingRequestDTO.getShowId())
                .orElseThrow(() -> new RuntimeException("Show doesn't exist"));

        Booking booking = mapToBooking(createBookingRequestDTO, show);
        List<UUID> seatIds = createBookingRequestDTO.getSeatIds();
        List<ShowSeat> showSeats = showSeatRepository.findByShowAndSeatIdInAndSeatStatus(show, seatIds,
                ShowSeatStatus.AVAILABLE);
        if (showSeats.size() != seatIds.size())
            throw new RuntimeException("Partial Booking, Invalid Seat selection");
        List<BookingSeat> bookingSeats = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (ShowSeat showSeat : showSeats) {
            totalAmount = totalAmount.add(showSeat.getPrice());
            try {
                showSeat.setSeatStatus(ShowSeatStatus.RESERVED);
            } catch (ObjectOptimisticLockingFailureException e) {
                throw new RuntimeException("Seat was reserved by another user.");
            }

            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setSeat(showSeat.getSeat());
            bookingSeat.setBooking(booking);
            bookingSeats.add(bookingSeat);
        }
        booking.setTotalAmount(totalAmount);
        booking = bookingRepository.save(booking);
        bookingSeatRepository.saveAll(bookingSeats);

        try {
            CreateOrderResponseDto createOrderResponseDto = paymentService.createOrder(booking);
            return createOrderResponseDto;

        } catch (RazorpayException re) {
            throw new RuntimeException("Razorpay error while creating order", re);
        }

    }

    @Transactional
    public Booking confirmBooking(UUID bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking id doesn't exist"));
        booking.setStatus(BookingStatus.BOOKED);
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking(booking);

        for (BookingSeat bookingSeat : bookingSeats) {
            Seat seat = bookingSeat.getSeat();
            ShowSeat showSeat = showSeatRepository.findByShowAndSeat(booking.getShow(), seat);
            showSeat.setSeatStatus(ShowSeatStatus.BOOKED);
        }

        return booking;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireBooking() {

        List<Booking> pendingBookings = bookingRepository.findAllByStatusAndExpiresAtBefore(
                BookingStatus.PENDING,
                LocalDateTime.now());

        for (Booking pendingBooking : pendingBookings) {

            pendingBooking.setStatus(BookingStatus.EXPIRED);

            List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking(pendingBooking);

            for (BookingSeat bookingSeat : bookingSeats) {
                ShowSeat showSeat = showSeatRepository.findByShowAndSeat(
                        pendingBooking.getShow(),
                        bookingSeat.getSeat());

                showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
            }
        }
    }

    public Booking mapToBooking(CreateBookingRequestDTO createBookingRequestDTO, Show show) {
        Booking booking = new Booking();
        booking.setShow(show);
        booking.setStatus(BookingStatus.PENDING);
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        return booking;
    }

}
