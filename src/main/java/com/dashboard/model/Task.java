package com.dashboard.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@Entity
@Table(name = "Task")
@Inheritance(strategy = InheritanceType.JOINED) // Meka thamai magic eka karanne
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "taskType",
    visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = Assignment.class, name = "Assignment"),
    @JsonSubTypes.Type(value = Personal.class, name = "Personal"),
    @JsonSubTypes.Type(value = Clubs.class, name = "Clubs")
})
public abstract class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskId;

    private String taskName;
    private LocalDate date;
    private LocalTime time;

    private String taskType; // Changed from TaskType enum
    private boolean isCompleted = false;

    // Student table ekata thiyena foreign key relationship eka
    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "urgencyProfileId")
    private UrgencyProfile urgencyProfile;

    // Getters and Setters
    public int getTaskId() { return taskId; }
    public void setTaskId(int taskId) { this.taskId = taskId; }

    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public UrgencyProfile getUrgencyProfile() { return urgencyProfile; }
    public void setUrgencyProfile(UrgencyProfile urgencyProfile) { this.urgencyProfile = urgencyProfile; }

    public boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(boolean isCompleted) { this.isCompleted = isCompleted; }
}