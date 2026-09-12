# BookingSystem

A Spring Boot-based movie theater ticket booking platform with integrated payment processing, JWT authentication, and optimistic locking for concurrent seat reservations.

## 🎯 Overview

BookingSystem is a production-ready REST API for managing movie theater bookings. It handles the complete booking lifecycle: movie browsing → seat selection → payment processing → booking confirmation, with built-in protection against race conditions in concurrent seat reservations.

## ✨ Key Features

- **Movie & Show Management** - Create and manage movies, shows, screens, and seats
- **Real-time Seat Booking** - Reserve seats with automatic 5-minute expiration
- **Payment Integration** - Seamless Razorpay integration for secure payments
- **JWT Authentication** - Secure token-based user authentication
- **Concurrency Control** - Optimistic locking prevents double-booking race conditions
- **User Authorization** - Users can only access/modify their own bookings
- **Automatic Cleanup** - Scheduler releases expired bookings every 60 seconds

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Language** | Java 25 |
| **Framework** | Spring Boot 4.0.7 |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JJWT 0.13.0) |
| **Payment Gateway** | Razorpay |
| **ORM** | Spring Data JPA / Hibernate |
| **Build Tool** | Maven |

## 📦 Project Structure

```
src/main/java/com/app/bs/BookingSystem/
├── modules/
│   ├── auth/              # JWT login & token generation
│   ├── user/              # User registration & management
│   ├── movies/            # Movie catalog
│   ├── shows/             # Movie scheduling
│   ├── screens/           # Theater screens/auditoriums
│   ├── seats/             # Seat inventory
│   ├── showSeats/         # Seat availability per show (★ concurrency)
│   ├── bookings/          # Booking CRUD (★ critical section)
│   ├── bookingSeat/       # Booking-seat mappings
│   ├── payments/          # Razorpay payment processing
│   └── languages/         # i18n support
├── security/              # JWT service & filters
└── config/                # Spring Security configuration
```

## 🔄 Request Flow

```
1. User Registration → POST /users
2. User Login → POST /auth/login (returns JWT)
3. Browse Movies → GET /movies
4. View Shows → GET /shows
5. Create Booking → POST /bookings (reserves seats)
6. Razorpay Payment → Payment gateway processes payment
7. Verify Payment → POST /payments/verify (confirms booking)
```

## 🛡️ Concurrency Handling

**Problem:** Multiple users booking same seat simultaneously → Race condition

**Solution:** Optimistic Locking with `@Version` annotation

```java
@Entity
public class ShowSeat {
    @Version
    private Long version;  // Automatically managed by Hibernate
    
    @Enumerated(EnumType.STRING)
    private ShowSeatStatus seatStatus;  // AVAILABLE, RESERVED, BOOKED
}
```

**How it works:**
1. User A & B both query Seat X (version=1, status=AVAILABLE)
2. User A updates Seat X → RESERVED (version becomes 2)
3. User B tries to update → Version mismatch detected
4. User B gets error: "Seat was reserved by another user"
5. Zero chance of double-booking ✓

See [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md) for detailed concurrency explanation.

## 🚀 Getting Started

### Prerequisites
- Java 25+
- Maven 3.6+
- PostgreSQL 12+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manudeep07/BookingSystem.git
   cd BookingSystem
   ```

2. **Configure Database**
   - Create PostgreSQL database: `booking_system_db`
   - Update `application.yml` with your credentials
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/booking_system_db
       username: postgres
       password: your_password
   ```

3. **Run the Application**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Server starts on** `http://localhost:8080`

## 📡 API Endpoints

### Authentication
```
POST   /auth/login                    Login & get JWT token
```

### Users
```
POST   /users                         Register new user
GET    /users                         Get all users
```

### Movies
```
POST   /movies                        Add new movie
GET    /movies                        Get all movies
```

### Shows
```
POST   /shows                         Create a show
GET    /shows                         List shows
```

### Bookings ⭐ (Critical Section)
```
POST   /bookings                      Create booking (reserves seats with optimistic lock)
POST   /bookings/cancel               Cancel booking (releases seats)
```

### Payments
```
POST   /payments/verify               Verify Razorpay payment & confirm booking
```

## 🔐 Security

- **JWT Authentication** - All protected endpoints require valid JWT token
- **Spring Security** - Request filtering and authorization
- **Authorization** - Users can only access their own bookings
- **Optimistic Locking** - Prevents concurrent seat overselling
- **Transaction Safety** - `@Transactional` ensures ACID properties

## ⚙️ Configuration

```yaml
# application.yml
jwt:
  secret: your-super-secret-key-that-is-long-enough-for-hs256
  expiration: 3600000  # 1 hour

razorpay:
  key-id: rzp_test_TMvd30sVLuJM3f
  key-secret: DGmmrzBfYkBUki59XR6B73yi

booking:
  expiry-minutes: 5  # Booking expires in 5 minutes if payment not completed

scheduler:
  expiry-check-interval: 60000  # Check for expired bookings every 60 seconds
```

## 📊 Database Schema

### Key Tables
- **users** - User accounts
- **movies** - Movie catalog
- **shows** - Movie scheduling (movie + screen + time)
- **screens** - Theater screens/auditoriums
- **seats** - Physical seat inventory
- **show_seats** - Seat availability per show (★ has version for optimistic locking)
- **bookings** - Booking records
- **booking_seats** - Booking-seat mappings
- **payments** - Payment records

## 🧪 Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn clean test jacoco:report
```

## 🔍 Troubleshooting

**Issue:** Connection refused to PostgreSQL
- **Solution:** Ensure PostgreSQL is running on localhost:5432

**Issue:** "Seat was reserved by another user"
- **Solution:** This is expected during concurrent bookings - optimistic locking in action ✓

**Issue:** JWT token expired
- **Solution:** Login again to get a new token

## 📝 Database Setup Example

```sql
CREATE DATABASE booking_system_db;

-- Hibernate will auto-create tables with DDL auto-update
-- No manual schema creation needed
```

## 🎓 Learn More

- [Full Project Documentation](PROJECT_DESCRIPTION.md) - Deep dive into architecture & concurrency
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Razorpay API](https://razorpay.com/docs/api/)
- [JWT Guide](https://jwt.io/)

## 👤 Author

**Manudeep** - [GitHub Profile](https://github.com/manudeep07)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Show your support by giving a ⭐ if this project helped you!**
