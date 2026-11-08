package com.app.bs.BookingSystem.modules.resetToken;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.bs.BookingSystem.modules.user.User;

@Repository 
public interface ResetTokenRepository extends JpaRepository<ResetToken,UUID>{
    Optional<ResetToken> findByToken(String token);

    void deleteByUser(User user);
}
