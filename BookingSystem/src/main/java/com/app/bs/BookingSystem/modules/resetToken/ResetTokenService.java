package com.app.bs.BookingSystem.modules.resetToken;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.user.User;
import com.app.bs.BookingSystem.modules.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ResetTokenService {

    private final ResetTokenRepository resetTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResetTokenService(ResetTokenRepository resetTokenRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.resetTokenRepository = resetTokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String createToken(User user) {
        resetTokenRepository.deleteByUser(user);
        String token = UUID.randomUUID().toString();
        ResetToken rt = new ResetToken();
        rt.setUser(user);
        rt.setResetToken(hashToken(token));
        rt.setExpiry(LocalDateTime.now().plusMinutes(10));
        resetTokenRepository.save(rt);
        return token;
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        ResetToken rt = resetTokenRepository.findByResetToken(hashToken(token))
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));
        if (rt.getExpiry().isBefore(LocalDateTime.now())) {
            resetTokenRepository.delete(rt);
            throw new RuntimeException("Invalid or expired token");
        }
        User user = rt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetTokenRepository.delete(rt);
    }

    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 algorithm not available", e);
        }
    }

}
