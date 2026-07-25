package com.dashboard.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "UrgencyProfile")
public class UrgencyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private double estimatedEffortInHours;
    private double weight;
    private double urgencyScore;
    private double remainingWorkload;
    private LocalDate deadline;

    @OneToOne(mappedBy = "urgencyProfile")
    private Task task;

    @OneToOne(mappedBy = "urgencyProfile", cascade = CascadeType.ALL)
    private UrgencyScoreDashboard dashboard;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public double getEstimatedEffortInHours() { return estimatedEffortInHours; }
    public void setEstimatedEffortInHours(double estimatedEffortInHours) { this.estimatedEffortInHours = estimatedEffortInHours; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(double urgencyScore) { this.urgencyScore = urgencyScore; }

    public double getRemainingWorkload() { return remainingWorkload; }
    public void setRemainingWorkload(double remainingWorkload) { this.remainingWorkload = remainingWorkload; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public UrgencyScoreDashboard getDashboard() { return dashboard; }
    public void setDashboard(UrgencyScoreDashboard dashboard) { this.dashboard = dashboard; }
}
