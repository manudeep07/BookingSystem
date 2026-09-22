# BookingSystem - Project Description

**BookingSystem** is a Spring Boot-based movie theater ticket booking platform with integrated payment processing. It provides a complete REST API for managing movie shows, theater operations, seat bookings, and payment transactions with JWT authentication and optimistic locking for concurrent seat reservations.

## Stack
- **Language(s):** Java 25
- **Framework / runtime:** Spring Boot 4.0.7
- **Notable libraries:** 
  - Spring Security (JWT authentication)
  - JJWT 0.13.0 (JWT token generation & validation)
  - Razorpay Payment Gateway (payment processing)
  - Spring Data JPA (ORM layer)
  - PostgreSQL (relational database)
  - Lombok (boilerplate reduction)

## Repository Organization

```
BookingSystem/
  modules/
    auth/            JWT authentication, login endpoints
    user/            User management and registration
    movies/          Movie catalog management
    theater/         Theater/cinema management
    screens/         Screen/auditorium management
    shows/           Movie show scheduling
    seats/           Seat inventory management
    bookingSeat/     Seat booking mappings (junction table)
    showSeats/       Show-specific seat availability (critical for concurrency)
    bookings/        Booking creation, cancellation, and confirmation
    payments/        Payment processing with Razorpay
    languages/       Language/localization support
  security/         JWT service, authentication filters
  config/           Spring Security configuration
```

## How It Fits Together

**Request Flow:**
1. User registers via `/users` endpoint
2. User authenticates via `/auth/login`, receives JWT token
3. User browses `/movies` and `/shows` endpoints
4. User selects seats and creates booking via `POST /bookings`
5. System initiates Razorpay payment, returns payment order
6. User completes payment on Razorpay
7. Frontend verifies payment via `POST /payments/verify`
8. System confirms booking and marks seats as BOOKED

**Data Flow:**
- Movies → Shows (many shows per movie)
- Shows → Screens (show scheduled in a specific screen)
- Screens → Seats (multiple seats per screen)
- Shows + Seats → ShowSeats (seat availability per show)
- ShowSeats → Bookings (seats reserved/booked in a booking)
- Bookings → Payments (payment for a booking)

## Concurrency & Critical Section Handling

### Problem
Multiple concurrent users can attempt to book the same seats simultaneously, leading to race conditions where multiple bookings could reserve/book the same seat.

### Solution: Optimistic Locking with Version Field

**1. ShowSeat Entity - Version Annotation**
```java
@Entity
@Table(name = "show_seats")
public class ShowSeat {
    @Id
    private UUID id;
    
    @ManyToOne
    private Seat seat;
    
    @ManyToOne
    private Show show;
    
    @Enumerated(EnumType.STRING)
    private ShowSeatStatus seatStatus; // AVAILABLE, RESERVED, BOOKED
    
    @Version  // ← Enables optimistic locking
    private Long version;
}
```

The `@Version` annotation tells Hibernate to track row versions. Every update increments this version number.

**2. Transactional Booking Creation**
```java
@Transactional
public CreateOrderResponseDto createBooking(CreateBookingRequestDTO dto, User user) {
    // Query all requested seats with AVAILABLE status
    List<ShowSeat> showSeats = showSeatRepository
        .findByShowAndSeatIdInAndSeatStatus(show, seatIds, ShowSeatStatus.AVAILABLE);
    
    // Verify all requested seats are still available
    if (showSeats.size() != seatIds.size())
        throw new RuntimeException("seats are already booked/reserved by another user");
    
    // Mark all seats as RESERVED within same transaction
    for (ShowSeat showSeat : showSeats) {
        try {
            showSeat.setSeatStatus(ShowSeatStatus.RESERVED);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("Seat was reserved by another user.");
        }
    }
    
    // Save booking and booking-seat mappings in same transaction
    booking = bookingRepository.save(booking);
    bookingSeatRepository.saveAll(bookingSeats);
    
    // Create Razorpay payment order
    return paymentService.createOrder(booking);
}
```

**3. How It Works**

When multiple requests try to book the same seat:

1. **Request A & B both query seat X** (version = 1) with AVAILABLE status
2. **Request A updates seat X** (AVAILABLE → RESERVED, version becomes 2)
3. **Request B tries to update seat X** (version = 1, but actual version = 2)
4. **Hibernate detects version mismatch** → throws `ObjectOptimisticLockingFailureException`
5. **Request B fails with "Seat was reserved by another user"**

This happens **within a single transaction** at the database level, ensuring atomicity.

**4. Seat Status States**

```
AVAILABLE  → Seat not booked
  ↓ (on createBooking)
RESERVED   → Seat reserved for 5 minutes (awaiting payment)
  ↓ (on confirmBooking - payment success)
BOOKED     → Seat confirmed and paid
  ↓ (on cancelBooking - if within show start time)
AVAILABLE  → Seat released back
```

If payment fails or times out (5 min expiry):
```
RESERVED  → (expireBooking scheduler)  → AVAILABLE
```

**5. Scheduled Booking Expiration**

```java
@Scheduled(fixedRate = 60000)  // Every 60 seconds
@Transactional
public void expireBooking() {
    // Find all PENDING bookings past their 5-minute expiry
    List<Booking> pendingBookings = bookingRepository
        .findAllByStatusAndExpiresAtBefore(BookingStatus.PENDING, LocalDateTime.now());
    
    // Release all their seats back to AVAILABLE
    for (Booking booking : pendingBookings) {
        for (ShowSeat seat : booking.getShowSeats()) {
            seat.setSeatStatus(ShowSeatStatus.AVAILABLE);
        }
    }
}
```

### Key Advantages

1. **No Database Locks** → High concurrency, no deadlocks
2. **Atomic at Transaction Level** → Entire booking operation succeeds or fails together
3. **Version-Based Conflict Detection** → Detects changes between read and write
4. **Graceful Error Handling** → Users get clear error message instead of double-booking
5. **Automatic Seat Release** → Scheduler handles expired reservations

## Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/login` | User login, returns JWT token |
| `POST` | `/users` | Register new user |
| `GET` | `/users` | List all users |
| `POST` | `/movies` | Add new movie |
| `GET` | `/movies` | Get all movies |
| `POST` | `/shows` | Create movie show for theater/screen/time |
| `GET` | `/shows` | Get shows for a movie |
| `POST` | `/bookings` | **Create booking (triggers payment, uses optimistic locking)** |
| `POST` | `/bookings/cancel` | Cancel confirmed booking (releases seats) |
| `POST` | `/payments/verify` | Verify Razorpay payment & confirm booking |

## Database Configuration

- **Database:** PostgreSQL (`booking_system_db`)
- **Credentials:** postgres / Manudeep@050607 (on localhost:5432)
- **ORM:** Hibernate with auto schema update (`ddl-auto: update`)
- **Logging:** SQL queries logged and formatted for debugging

## Running the Application

```bash
# Option 1: Using Maven
mvn clean install
mvn spring-boot:run

# Option 2: Using Maven Wrapper (Linux/Mac)
./mvnw spring-boot:run

# Option 3: Using Maven Wrapper (Windows)
mvnw.cmd spring-boot:run

# Application starts on http://localhost:8080
```

### Configuration

- **Server Port:** 8080
- **JWT Secret:** your-super-secret-key-that-is-long-enough-for-hs256
- **JWT Expiration:** 1 hour (3600000 ms)
- **Payment Gateway:** Razorpay (test mode)
  - Key ID: `rzp_test_TMvd30sVLuJM3f`
  - Key Secret: `DGmmrzBfYkBUki59XR6B73yi`
- **Booking Expiry:** 5 minutes (if payment not completed)
- **Scheduler Frequency:** Every 60 seconds (checks for expired bookings)

## Security Features

- **JWT-based Authentication** → All protected endpoints require valid JWT
- **Spring Security Integration** → Request filtering and authorization
- **User Authorization Checks** → Users can only modify their own bookings
- **Optimistic Locking** → Prevents concurrent seat overselling
- **Transaction Safety** → `@Transactional` ensures ACID properties

## Technical Highlights

1. **Modular Architecture** → Each domain (movies, shows, bookings, payments) is a separate module
2. **DTO Pattern** → Request/Response DTOs for API contracts
3. **Service Layer Pattern** → Business logic separated from controllers
4. **Repository Pattern** → Data access abstraction via Spring Data JPA
5. **Error Handling** → Try-catch for Razorpay errors, transaction rollback on failures
6. **Scheduled Tasks** → Background job to clean up expired bookings
