package com.app.bs.BookingSystem.modules.user;

import java.util.List;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.bookings.Booking;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    // @NotBlank(message = "Mobile number cannot be empty")
    // @Pattern(
    //     regexp = "^[0-9]{10}$",
    //     message = "Mobile number must contain exactly 10 digits"
    // )
    // @Column(unique = true)
    // private String mobileNumber;

    @NotBlank(message = "password cannot be empty")
    // @JsonIgnore 
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.CUSTOMER;
}