package com.app.bs.BookingSystem.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException ex) throws IOException {
        String message = (String) request.getAttribute("auth_error");
        if (message == null) message = "Authentication required. Please log in.";
        SecurityErrorWriter.write(request, response, HttpStatus.UNAUTHORIZED, message);
    }
}