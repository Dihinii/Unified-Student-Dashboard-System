package com.dashboard.service;

import com.dashboard.model.UrgencyProfile;

public interface UrgencyCalculator {
    double calculateUrgencyScore(UrgencyProfile profile);
}
