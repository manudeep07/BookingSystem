package com.app.bs.BookingSystem.modules.bookings;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.exception.ForbiddenException;
import com.app.bs.BookingSystem.modules.bookingSeat.BookingSeat;
import com.app.bs.BookingSystem.modules.bookingSeat.BookingSeatRepository;
import com.app.bs.BookingSystem.modules.bookings.DTO.BookingResponseDto;
import com.app.bs.BookingSystem.modules.bookings.DTO.CancelBookingRequestDTO;
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
import com.app.bs.BookingSystem.modules.user.User;
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
    public CreateOrderResponseDto createBooking(CreateBookingRequestDTO createBookingRequestDTO, User user) {

        Show show = showRepository.findById(createBookingRequestDTO.getShowId())
                .orElseThrow(() -> new RuntimeException("Show doesn't exist"));

        Booking booking = mapToBooking(createBookingRequestDTO, show, user);
        List<UUID> seatIds = createBookingRequestDTO.getSeatIds();
        List<ShowSeat> showSeats = showSeatRepository.findByShowAndSeatIdInAndSeatStatus(show, seatIds,
                ShowSeatStatus.AVAILABLE);
        if (showSeats.size() != seatIds.size())
            throw new RuntimeException("seats are already booked/reserved by another user");

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
    public BookingResponseDto confirmBooking(UUID bookingId, String paymentStatus, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking id doesn't exist"));

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.EXPIRED) {
            throw new RuntimeException("Booking is no longer pending ");
        }

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You don't own this booking");
        }

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking(booking);
        List<Seat> seats = bookingSeats.stream()
                .map(BookingSeat::getSeat)
                .toList();
        List<ShowSeat> showSeats = showSeatRepository.findByShowAndSeatIn(booking.getShow(), seats);
        if ("success".equals(paymentStatus)) {
            if (booking.getStatus() == BookingStatus.EXPIRED) {
                ArrayList<ShowSeat> tempShowSeats = new ArrayList<>();
                for (ShowSeat showSeat : showSeats) {
                    if (showSeat.getSeatStatus() != ShowSeatStatus.AVAILABLE) {
                        for (ShowSeat ss : tempShowSeats) {
                            ss.setSeatStatus(ShowSeatStatus.AVAILABLE);
                        }
                        booking.setStatus(BookingStatus.FAILED);
                        paymentService.refundPayment(booking);
                        return mapToBookingResponseDto(booking);
                    } else {
                        showSeat.setSeatStatus(ShowSeatStatus.BOOKED);
                        tempShowSeats.add(showSeat);
                    }
                }
                booking.setStatus(BookingStatus.BOOKED);
            } else {
                for (ShowSeat showSeat : showSeats) {
                    showSeat.setSeatStatus(ShowSeatStatus.BOOKED);
                }
                booking.setStatus(BookingStatus.BOOKED);
            }
        } else {
            booking.setStatus(BookingStatus.FAILED);
            for (ShowSeat showSeat : showSeats) {
                showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
            }
        }

        return mapToBookingResponseDto(booking);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireBooking() {
        List<Booking> pendingBookings = bookingRepository.findAllByStatusAndExpiresAtBefore(
                BookingStatus.PENDING,
                LocalDateTime.now());

        if (pendingBookings.isEmpty())
            return;

        List<BookingSeat> allBookingSeats = bookingSeatRepository.findByBookingIn(pendingBookings);
        Map<Booking, List<BookingSeat>> seatsByBooking = allBookingSeats.stream()
                .collect(Collectors.groupingBy(BookingSeat::getBooking));

        for (Booking pendingBooking : pendingBookings) {
            pendingBooking.setStatus(BookingStatus.EXPIRED);

            List<BookingSeat> bookingSeats = seatsByBooking.getOrDefault(pendingBooking, List.of());
            List<Seat> seats = bookingSeats.stream().map(BookingSeat::getSeat).toList();
            List<ShowSeat> showSeats = showSeatRepository.findByShowAndSeatIn(pendingBooking.getShow(), seats);

            for (ShowSeat showSeat : showSeats) {
                showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
            }
        }
    }

    public Booking mapToBooking(CreateBookingRequestDTO createBookingRequestDTO, Show show, User user) {
        Booking booking = new Booking();
        booking.setShow(show);
        booking.setUser(user);
        booking.setStatus(BookingStatus.PENDING);
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        return booking;
    }

    @Transactional
    public BookingResponseDto cancelBooking(CancelBookingRequestDTO cancelBookingRequestDTO,
            User user) {
        Booking booking = bookingRepository
                .findById(cancelBookingRequestDTO.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking doesn't exists"));

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new RuntimeException("The tickets are not yet booked");
        }

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You don't own this booking");
        }

        Show show = booking.getShow();
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime showTime = show.getStartTime();

        if (showTime.isBefore(currentTime)) {
            throw new RuntimeException("Show is completed, cannot cancel");
        }

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking(booking);
        List<Seat> seats = bookingSeats.stream()
                .map(BookingSeat::getSeat)
                .toList();
        List<ShowSeat> showSeats = showSeatRepository.findByShowAndSeatIn(show, seats);

        for (ShowSeat showSeat : showSeats) {
            showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        paymentService.refundPayment(booking);

        return mapToBookingResponseDto(booking);
    }

    public BookingResponseDto mapToBookingResponseDto(Booking booking) {
        return new BookingResponseDto(
                booking.getId(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getExpiresAt());
    }

}
