package com.app.bs.BookingSystem.modules.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.app.bs.BookingSystem.security.JwtService;

import io.jsonwebtoken.Jwt;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

   @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    Authentication authResult = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    UserDetails userDetails = (UserDetails) authResult.getPrincipal();
    String token = jwtService.generateToken(userDetails);

    return new LoginResponse(token);
}
}