package com.app.bs.BookingSystem.modules.auth;

import java.util.UUID;

import com.app.bs.BookingSystem.modules.user.User;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity 
public class ResetPassword {
    @Id
    @GeneratedValue
    private UUID id;
    
    @OneToOne 
    @JoinColumn(name = "user_id")
    User user;

    String resetToken;
}
