package com.app.bs.BookingSystem.modules.user.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
public class CreateUserRequestDto {

    @NotBlank  (message = "name cannot be empty")
    private  String name;

    @Email (message = "Invalid email")
    @NotBlank (message = "email cannot be empty")
    private  String email;

    @NotBlank (message = "password cannot be empty")
    private  String password;
}
