package com.dashboard.service;

import com.dashboard.model.UrgencyProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UrgencyCalculatorTest {

    private UrgencyCalculator urgencyCalculator;

    @BeforeEach
    public void setUp() {
        urgencyCalculator = new UrgencyCalculatorImpl();
    }

    @Test
    public void testCalculateUrgencyScore_FutureDeadline() {
        UrgencyProfile profile = new UrgencyProfile();
        profile.setWeight(2.0);
        profile.setEstimatedEffortInHours(5.0);
        // deadline is 10 days from now
        profile.setDeadline(LocalDate.now().plusDays(10));

        // expected score: (2.0 * 5.0) / 10 = 1.0
        double score = urgencyCalculator.calculateUrgencyScore(profile);
        assertEquals(1.0, score, 0.01);
    }

    @Test
    public void testCalculateUrgencyScore_PastDeadline() {
        UrgencyProfile profile = new UrgencyProfile();
        profile.setWeight(2.0);
        profile.setEstimatedEffortInHours(5.0);
        // deadline is 2 days ago
        profile.setDeadline(LocalDate.now().minusDays(2));

        // max(-2, 0.5) = 0.5
        // expected score: (2.0 * 5.0) / 0.5 = 20.0
        double score = urgencyCalculator.calculateUrgencyScore(profile);
        assertEquals(20.0, score, 0.01);
    }

    @Test
    public void testCalculateUrgencyScore_TodayDeadline() {
        UrgencyProfile profile = new UrgencyProfile();
        profile.setWeight(3.0);
        profile.setEstimatedEffortInHours(2.0);
        // deadline is today
        profile.setDeadline(LocalDate.now());

        // max(0, 0.5) = 0.5
        // expected score: (3.0 * 2.0) / 0.5 = 12.0
        double score = urgencyCalculator.calculateUrgencyScore(profile);
        assertEquals(12.0, score, 0.01);
    }
}
