package com.dashboard.service;

import com.dashboard.model.UrgencyProfile;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class UrgencyCalculatorImpl implements UrgencyCalculator {

    @Override
    public double calculateUrgencyScore(UrgencyProfile profile) {
        if (profile == null || profile.getDeadline() == null) {
            return 0.0;
        }

        long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDate.now(), profile.getDeadline());
        double maxDays = Math.max(daysUntilDeadline, 0.5);

        // urgencyScore = (weight * estimatedEffortInHours) / max(daysUntilDeadline, 0.5)
        return (profile.getWeight() * profile.getEstimatedEffortInHours()) / maxDays;
    }
}
