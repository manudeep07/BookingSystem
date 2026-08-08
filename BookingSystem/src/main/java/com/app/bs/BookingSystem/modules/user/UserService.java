package com.app.bs.BookingSystem.modules.user;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.modules.bookings.BookingRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public User createUser(User user){
       return userRepository.save(user);
    }
    
    public List<User> getUsers(){
        return userRepository.findAll();
    }

    
}
