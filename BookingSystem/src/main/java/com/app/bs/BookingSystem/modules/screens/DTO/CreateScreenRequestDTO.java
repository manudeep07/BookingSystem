package com.app.bs.BookingSystem.modules.screens.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateScreenRequestDTO {
    @NotBlank
    private String screenName;

    @NotNull
    private UUID theaterId;
}
