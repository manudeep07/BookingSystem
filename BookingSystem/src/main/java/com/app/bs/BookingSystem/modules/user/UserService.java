package com.app.bs.BookingSystem.modules.user;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.user.DTO.UserResponseDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto createUser(User user) {

        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        userRepository.save(user);
        return mapTouserResponseDto(user);
    }

    public List<UserResponseDto> getUsers() {
        List<User> users= userRepository.findAll();
        return users.stream().map(x->mapTouserResponseDto(x)).toList();
    }

    public UserResponseDto mapTouserResponseDto(User user) {
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setName(user.getName());
        return userResponseDto;
    }
}
