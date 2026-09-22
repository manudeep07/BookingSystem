package com.app.bs.BookingSystem.modules.bookings;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.shows.Show;
import com.app.bs.BookingSystem.modules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "show_id")
    @JsonIgnore
    private Show show;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore 
    private User user;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(nullable = false, precision = 10, scale = 2, name = "total_amount")
    private BigDecimal totalAmount;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
