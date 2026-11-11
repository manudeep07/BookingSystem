package com.app.bs.BookingSystem.modules.auth;

import javax.management.Notification;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.auth.DTO.ForgotPasswordRequest;
import com.app.bs.BookingSystem.modules.auth.DTO.ResetPasswordRequestDto;
import com.app.bs.BookingSystem.modules.notification.NotificationService;
import com.app.bs.BookingSystem.modules.resetToken.ResetTokenService;
import com.app.bs.BookingSystem.modules.user.UserService;
import com.app.bs.BookingSystem.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final ResetTokenService resetTokenService;
    private final NotificationService notificationService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Authentication authResult = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails userDetails = (UserDetails) authResult.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(token);
    }

    @PostMapping("/forgot-password")
    public String forgotPass(@Valid @RequestBody ForgotPasswordRequest req) {
         System.out.println();
         String token = userService.forgotPass(req.getEmail());
         notificationService.sendPasswordResetEmail(req.getEmail(), token);
         return "if that email is registered,reset link will be sent";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequestDto req) {
        resetTokenService.resetPassword(req.getToken(), req.getNewPassword());
        return "password reset successfully";
    }
}