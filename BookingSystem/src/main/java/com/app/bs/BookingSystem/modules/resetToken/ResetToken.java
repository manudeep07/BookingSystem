package com.app.bs.BookingSystem.modules.resetToken;

import java.time.LocalDateTime;
import java.util.UUID;

import com.app.bs.BookingSystem.modules.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@Setter 
public class ResetToken {
    @Id
    @GeneratedValue
    private UUID id;
    
    @ManyToOne  
    @JoinColumn(name = "user_id")
    User user;

    String resetToken;

    LocalDateTime expiry;
}
