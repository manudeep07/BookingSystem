package com.app.bs.BookingSystem.modules.bookings;

import com.app.bs.BookingSystem.modules.bookingSeat.BookingSeat;
import com.app.bs.BookingSystem.modules.bookingSeat.BookingSeatRepository;
import com.app.bs.BookingSystem.modules.bookings.DTO.CreateBookingRequestDTO;
import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.seats.SeatRepository;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeat;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeatRepository;
import com.app.bs.BookingSystem.modules.showSeats.ShowSeatStatus;
import com.app.bs.BookingSystem.modules.shows.Show;
import com.app.bs.BookingSystem.modules.shows.ShowRepository;
import jakarta.transaction.Transactional;
import org.springframework.cglib.core.Local;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import javax.management.RuntimeErrorException;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final ShowSeatRepository showSeatRepository;
    private final BookingSeatRepository bookingSeatRepository;


    public BookingService(BookingRepository bookingRepository, ShowRepository showRepository
    , SeatRepository seatRepository, ShowSeatRepository showSeatRepository
    ,BookingSeatRepository bookingSeatRepository){
        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.showSeatRepository = showSeatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @Transactional
    public Booking createBooking(CreateBookingRequestDTO createBookingRequestDTO){
        Show show = showRepository.findById(createBookingRequestDTO.getShowId())
                .orElseThrow(()-> new RuntimeException("Show doesn't exist"));

        Booking bookingObj = mapToBooking(createBookingRequestDTO,show);
        bookingObj = bookingRepository.save(bookingObj);
        List<UUID> seatIds = createBookingRequestDTO.getSeatIds();
        List<ShowSeat> showSeats = showSeatRepository.findByShowAndSeatIdInAndSeatStatus(show,seatIds,ShowSeatStatus.AVAILABLE);
        if(showSeats.size()!=seatIds.size()) throw new RuntimeException("Partial Booking, Invalid Seat selection");
        for(ShowSeat showSeat : showSeats){  
            
            try{
                showSeat.setSeatStatus(ShowSeatStatus.RESERVED);
                showSeatRepository.save(showSeat);
            }catch(ObjectOptimisticLockingFailureException e){
                throw new RuntimeException("Seat was reserved by another user.");
            }

            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setSeat(showSeat.getSeat());
            bookingSeat.setBooking(bookingObj);
            bookingSeatRepository.save(bookingSeat); 
        }
    return bookingObj;
    }

    @Transactional
    public Booking confirmBooking(UUID bookingId, String status) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking id doesn't exist"));

        if ("success".equals(status))
            booking.setStatus(BookingStatus.BOOKED);
        else
            booking.setStatus(BookingStatus.EXPIRED);

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBooking(booking);

        for (BookingSeat bookingSeat : bookingSeats) {
            Seat seat = bookingSeat.getSeat();
            ShowSeat showSeat = showSeatRepository.findByShowAndSeat(booking.getShow(), seat);

            if ("success".equals(status))
                showSeat.setSeatStatus(ShowSeatStatus.BOOKED);
            else
                showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
        }

        return booking;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireBooking() {

        List<Booking> pendingBookings =
                bookingRepository.findAllByStatusAndExpiresAtBefore(
                        BookingStatus.PENDING,
                        LocalDateTime.now());

        for (Booking booking : pendingBookings) {

            booking.setStatus(BookingStatus.EXPIRED);

            List<BookingSeat> bookingSeats =
                    bookingSeatRepository.findByBooking(booking);

            for (BookingSeat bookingSeat : bookingSeats) {
                System.out.println(booking.getShow().getId());
                System.out.println(bookingSeat.getSeat().getId());
                ShowSeat showSeat =
                        showSeatRepository.findByShowAndSeat(
                                booking.getShow(),
                                bookingSeat.getSeat());

                showSeat.setSeatStatus(ShowSeatStatus.AVAILABLE);
            }
        }
    }

    public Booking mapToBooking(CreateBookingRequestDTO createBookingRequestDTO,Show show){
        Booking booking = new Booking();
        booking.setShow(show);
        booking.setStatus(BookingStatus.PENDING);
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        return booking;
    }

}
