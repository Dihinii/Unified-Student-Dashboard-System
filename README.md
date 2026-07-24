# Unified Student Dashboard

## Overview
The **Unified Student Dashboard** is a full-stack Java web application designed to help university students consolidate their academic assignments, club/work responsibilities, and personal chores into a single, beautifully designed interface. 

Instead of just acting as a simple to-do list, this system intelligently computes an **urgency score** per task based on deadline proximity, estimated effort, and task weight, allowing students to focus on what matters most.

## Features
- **Smart Urgency Sorting**: Calculates task priority using a custom formula to highlight critical tasks.
- **Categorized Tasks**: Separates tasks dynamically into *Assignments*, *Clubs & Society*, and *Personal* goals.
- **Modern UI**: Features a breathtaking Dark Mode Glassmorphism design built with Tailwind CSS, including micro-animations and dynamic circular progress gauges.
- **RESTful API Backend**: Fully functional backend powered by Spring Boot and Spring Data JPA.

## Core Formula
The core feature of this dashboard is the Urgency Score Calculation, handled efficiently in the service layer:
```text
urgencyScore = (weight * estimatedEffortInHours) / max(daysUntilDeadline, 0.5)
```

## Tech Stack
- **Backend**: Java 17+, Spring Boot, Spring Data JPA, Hibernate
- **Database**: MySQL
- **Frontend**: HTML5, Thymeleaf, Vanilla JavaScript, Tailwind CSS v3
- **Architecture**: MVC (Model-View-Controller) Pattern
- **Build Tool**: Maven

## Object-Oriented Programming (OOP) Principles
This project is built with a strong emphasis on core OOP concepts:
- **Inheritance & Polymorphism**: Utilizes an abstract `Task` superclass extended by `Assignment`, `Clubs`, and `Personal` classes (mapped cleanly in MySQL).
- **Abstraction**: Uses Interfaces for service-layer contracts (e.g., `UrgencyCalculator`), hiding the complex math implementation details from the controllers.
- **Encapsulation**: Strict use of `private` fields with `public` getters/setters in Models to ensure data integrity and validation.
- **Composition/Aggregation**: Establishes 1-to-N relationships (Student has many Tasks) and 1-to-1 relationships (Task has an UrgencyProfile).

## Setup Instructions
1. Clone this repository to your local machine.
2. Ensure you have **MySQL** running locally.
3. Import the provided `studet_dashboard.sql` database schema into your MySQL server.
4. Update `src/main/resources/application.properties` with your MySQL username and password.
5. Build and run the Spring Boot application using your IDE (Eclipse/IntelliJ) or via Maven.
6. Navigate to `http://localhost:8080/` in your web browser to view the dashboard.

---
*Developed as a 2-person university group project.*
