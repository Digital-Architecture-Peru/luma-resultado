package com.example.banca.notification.application;

import com.example.banca.notification.domain.Channel;
import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.Preference;
import com.example.banca.notification.domain.PreferenceRepository;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PreferenceService {

    private record Key(EventType eventType, Channel channel) {
    }

    private final PreferenceRepository repository;

    public PreferenceService(PreferenceRepository repository) {
        this.repository = repository;
    }

    /** Matriz completa evento x canal; lo no guardado está habilitado por defecto. */
    @Transactional(readOnly = true)
    public List<Preference> effective(String customerId) {
        Map<Key, Boolean> stored = new HashMap<>();
        for (Preference p : repository.findByCustomer(customerId)) {
            stored.put(new Key(p.eventType(), p.channel()), p.enabled());
        }
        List<Preference> result = new ArrayList<>();
        for (EventType type : EventType.values()) {
            for (Channel channel : Channel.values()) {
                result.add(new Preference(type, channel, stored.getOrDefault(new Key(type, channel), true)));
            }
        }
        return result;
    }

    @Transactional(readOnly = true)
    public Set<Channel> enabledChannels(String customerId, EventType eventType) {
        Set<Channel> channels = EnumSet.noneOf(Channel.class);
        for (Preference p : effective(customerId)) {
            if (p.eventType() == eventType && p.enabled()) {
                channels.add(p.channel());
            }
        }
        return channels;
    }

    @Transactional
    public List<Preference> update(String customerId, List<Preference> updates) {
        updates.forEach(p -> repository.save(customerId, p));
        return effective(customerId);
    }
}
