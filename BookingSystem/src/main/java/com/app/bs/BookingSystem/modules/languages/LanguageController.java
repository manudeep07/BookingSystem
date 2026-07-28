package com.app.bs.BookingSystem.modules.languages;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/languages")
public class LanguageController {
    private LanguageService languageService;
    public LanguageController(LanguageService languageService){
        this.languageService = languageService;
    }

    @PostMapping()
    public Language createLanguage(@RequestBody Language language){
        return languageService.createLanguage(language);
    }

    @GetMapping()
    public List<Language> getAllLanguages(){
        return languageService.getAllLanuages();
    }
}
