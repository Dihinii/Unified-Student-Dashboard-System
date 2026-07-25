package com.dashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Personal")
public class Personal extends Task { // Task eken extend karanawa

    private String description;
    
    // boolean values SQL wala TINYINT/BOOLEAN widiyata map wenawa
    private boolean isRecurring; 
    private boolean snooze;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean isRecurring) {
        this.isRecurring = isRecurring;
    }

    public boolean isSnooze() {
        return snooze;
    }

    public void setSnooze(boolean snooze) {
        this.snooze = snooze;
    }
}