package com.app.bs.BookingSystem.modules.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.resetToken.ResetTokenService;
import com.app.bs.BookingSystem.modules.user.UserService;
import com.app.bs.BookingSystem.security.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final ResetTokenService resetTokenService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Authentication authResult = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails userDetails = (UserDetails) authResult.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(token);
    }

    @PostMapping("/forgot-password")
    public String forgotPass(@RequestBody String email) {
         System.out.println(email);
         System.out.println(userService.forgotPass(email));
         return "if that email is registered,reset link will be sent";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody String token,String newPassword) {
        resetTokenService.resetPassword(token, newPassword);
        return "password reset successfully";
    }
}