package com.app.bs.BookingSystem.modules.user;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.user.DTO.CreateUserRequestDto;
import com.app.bs.BookingSystem.modules.user.DTO.UserResponseDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto createUser(CreateUserRequestDto createUserRequestDto) {

        String encodedPassword = passwordEncoder.encode(createUserRequestDto.getPassword());

        createUserRequestDto.setPassword(encodedPassword);

        User user = mapToUser(createUserRequestDto);
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

    public User mapToUser(CreateUserRequestDto createUserRequestDto) {
        User user = new User();
        user.setEmail(createUserRequestDto.getEmail());
        user.setName(createUserRequestDto.getName());
        user.setPassword(createUserRequestDto.getPassword());
        user.setRole(UserRole.CUSTOMER);
        return user;
    }
    }

