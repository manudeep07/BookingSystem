package com.app.bs.BookingSystem.modules.user.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    @NotNull(message = "Name cannot be empty")
    String name;
    @NotNull(message = "Email cannot be empty")
    String email;
}
