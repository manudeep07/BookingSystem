package com.app.bs.BookingSystem.modules.resetToken;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
public class ResetTokenController {
    private ResetTokenService resetTokenService;

    public ResetTokenController(ResetTokenService resetTokenService) {
        this.resetTokenService = resetTokenService;
    }

    
}
