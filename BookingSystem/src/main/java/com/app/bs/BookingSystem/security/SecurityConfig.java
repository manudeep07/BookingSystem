package com.app.bs.BookingSystem.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final RestAccessDeniedHandler restAccessDeniedHandler;
        private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

        public SecurityConfig(
                        JwtAuthFilter jwtAuthFilter,
                        RestAccessDeniedHandler restAccessDeniedHandler,
                        RestAuthenticationEntryPoint restAuthenticationEntryPoint) {

                this.jwtAuthFilter = jwtAuthFilter;
                this.restAccessDeniedHandler = restAccessDeniedHandler;
                this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http)
                        throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(e -> e
                                                .authenticationEntryPoint(restAuthenticationEntryPoint)
                                                .accessDeniedHandler(restAccessDeniedHandler))

                                .authorizeHttpRequests(auth -> auth

                                                // ADMIN only
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/movies",
                                                                "/theaters",
                                                                "/screens",
                                                                "/languages",
                                                                "/shows",
                                                                "/seats")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/users")
                                                .hasRole("ADMIN")

                                                // Public
                                                .requestMatchers(
                                                                "/auth/login",
                                                                "/users",
                                                        "/auth/forgot-password",
                                                "/auth/reset-password")
                                                .permitAll()

                                                // Everything else requires authentication
                                                .anyRequest().authenticated())

                                .addFilterBefore(
                                                jwtAuthFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration)
                        throws Exception {

                return configuration.getAuthenticationManager();
        }
}