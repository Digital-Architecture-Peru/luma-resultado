package com.example.banca.notification.adapters.out.persistence;

import com.example.banca.notification.domain.Channel;
import com.example.banca.notification.domain.EventType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "notification_preference")
@IdClass(PreferenceEntity.Key.class)
class PreferenceEntity {

    @Id
    private String customerId;

    @Id
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @Id
    @Enumerated(EnumType.STRING)
    private Channel channel;

    @Column(nullable = false)
    private boolean enabled;

    protected PreferenceEntity() {
    }

    PreferenceEntity(String customerId, EventType eventType, Channel channel, boolean enabled) {
        this.customerId = customerId;
        this.eventType = eventType;
        this.channel = channel;
        this.enabled = enabled;
    }

    EventType eventType() { return eventType; }
    Channel channel() { return channel; }
    boolean enabled() { return enabled; }

    static class Key implements Serializable {
        private String customerId;
        private EventType eventType;
        private Channel channel;

        protected Key() {
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (!(o instanceof Key other)) {
                return false;
            }
            return Objects.equals(customerId, other.customerId)
                    && eventType == other.eventType && channel == other.channel;
        }

        @Override
        public int hashCode() {
            return Objects.hash(customerId, eventType, channel);
        }
    }
}
