package com.app.bs.BookingSystem.modules.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.bs.BookingSystem.modules.bookings.Booking;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @PostMapping()
    public User createUser(@RequestBody User user) {
       return userService.createUser(user);
    }
    
    @GetMapping()
    public List<User> getUsers() {
        return userService.getUsers();
    }


    
    
}
