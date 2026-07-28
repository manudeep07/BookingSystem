package com.app.bs.BookingSystem.modules.languages;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageService {
    private LanguageRepository languageRepository;
    public LanguageService(LanguageRepository languageRepository){
        this.languageRepository = languageRepository;
    }

    public Language createLanguage(Language language){
        return languageRepository.save(language);
    }
    public List<Language> getAllLanuages() {
        return languageRepository.findAll();
    }
}
