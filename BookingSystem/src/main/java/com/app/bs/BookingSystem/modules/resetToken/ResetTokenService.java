package com.app.bs.BookingSystem.modules.resetToken;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.user.User;

@Service
public class ResetTokenService {

    private final ResetTokenRepository resetTokenRepository;
    public ResetTokenService(ResetTokenRepository resetTokenRepository) {
        this.resetTokenRepository = resetTokenRepository;
    }
    public String generateToken(User user) {
        ResetToken resetToken = new ResetToken();
        String token = UUID.randomUUID().toString()
        resetToken.setResetToken(token);
        resetToken.setUser(user);
        resetToken.setExpiry(LocalDateTime.now().plusMinutes(10));
        return token;
    }

    public String resetPassword(String token) {
        ResetToken resetToken = resetTokenRepository.findByToken(token).orElseThrow(()->new RuntimeException("Token doesn't exists"));
        if (resetToken.getExpiry().isAfter(LocalDateTime.now())) {
            resetTokenRepository.deleteByUser(null);
            throw new RuntimeException("Token expired");
        }
        
        return "Sucess";
    }
}
