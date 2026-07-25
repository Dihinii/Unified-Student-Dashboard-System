package com.dashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "UrgencyScoreDashboard")
public class UrgencyScoreDashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "urgencyProfileId")
    private UrgencyProfile urgencyProfile;

    private String status;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public UrgencyProfile getUrgencyProfile() { return urgencyProfile; }
    public void setUrgencyProfile(UrgencyProfile urgencyProfile) { this.urgencyProfile = urgencyProfile; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
