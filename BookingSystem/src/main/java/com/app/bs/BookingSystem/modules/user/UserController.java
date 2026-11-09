package com.app.bs.BookingSystem.modules.user;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.user.DTO.CreateUserRequestDto;
import com.app.bs.BookingSystem.modules.user.DTO.UserResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @PostMapping()
    public UserResponseDto createUser(@Valid @RequestBody CreateUserRequestDto createUserRequestDto) {
       return userService.createUser(createUserRequestDto);
    }
    
    @GetMapping()
    public List<UserResponseDto> getUsers() {
        return userService.getUsers();
    }

   


    
    
}
