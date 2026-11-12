package com.app.bs.BookingSystem.modules.user;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.exception.ForbiddenException;
import com.app.bs.BookingSystem.modules.notification.NotificationService;
import com.app.bs.BookingSystem.modules.resetToken.ResetTokenService;
import com.app.bs.BookingSystem.modules.user.DTO.CreateUserRequestDto;
import com.app.bs.BookingSystem.modules.user.DTO.UserResponseDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResetTokenService resetTokenService;
    private final NotificationService notificationService;

    public UserResponseDto createUser(CreateUserRequestDto createUserRequestDto) {

        String encodedPassword = passwordEncoder.encode(createUserRequestDto.getPassword());

        createUserRequestDto.setPassword(encodedPassword);

        User user = mapToUser(createUserRequestDto);
        userRepository.save(user);
        return mapTouserResponseDto(user);
    }

    public List<UserResponseDto> getUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(x -> mapTouserResponseDto(x)).toList();
    }

    public UserResponseDto mapTouserResponseDto(User user) {
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setName(user.getName());
        return userResponseDto;
    }

    public User mapToUser(CreateUserRequestDto createUserRequestDto) {

        User user = new User();
        user.setEmail(createUserRequestDto.getEmail());
        user.setName(createUserRequestDto.getName());
        user.setPassword(createUserRequestDto.getPassword());
        user.setRole(UserRole.CUSTOMER);
        return user;
    }

    // UserService
    public void forgotPass(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = resetTokenService.createToken(user);
            notificationService.sendPasswordResetEmail(user.getEmail(), token);
        });
    }

}
