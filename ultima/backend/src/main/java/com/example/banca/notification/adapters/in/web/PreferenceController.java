package com.example.banca.notification.adapters.in.web;

import com.example.banca.notification.adapters.in.web.Dtos.PreferenceDto;
import com.example.banca.notification.adapters.in.web.Dtos.PreferencesUpdate;
import com.example.banca.notification.application.PreferenceService;
import com.example.banca.notification.domain.Preference;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notification-preferences")
public class PreferenceController {

    private final PreferenceService service;

    public PreferenceController(PreferenceService service) {
        this.service = service;
    }

    @GetMapping
    public List<PreferenceDto> get(@RequestHeader(NotificationController.CUSTOMER_HEADER) String customerId) {
        return service.effective(customerId).stream().map(NotificationMapper::toDto).toList();
    }

    @PutMapping
    public List<PreferenceDto> update(@RequestHeader(NotificationController.CUSTOMER_HEADER) String customerId,
                                      @Valid @RequestBody PreferencesUpdate body) {
        List<Preference> updates = body.preferences().stream().map(NotificationMapper::toDomain).toList();
        return service.update(customerId, updates).stream().map(NotificationMapper::toDto).toList();
    }
}
