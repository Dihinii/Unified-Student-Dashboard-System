DROP DATABASE IF EXISTS student_dashboard;
CREATE DATABASE student_dashboard;
USE student_dashboard;


CREATE TABLE Student (
    studentId   INT AUTO_INCREMENT PRIMARY KEY,
    userName    VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL
);


CREATE TABLE Task (
    taskId      INT AUTO_INCREMENT PRIMARY KEY,
    taskName    VARCHAR(100) NOT NULL,
    date        DATE NOT NULL,
    time        TIME NOT NULL,
    taskType    ENUM('Personal', 'Clubs', 'Assignment') NOT NULL,
    studentId   INT NOT NULL,
    CONSTRAINT fk_task_student
        FOREIGN KEY (studentId) REFERENCES Student(studentId)
        ON DELETE CASCADE
);


CREATE TABLE Personal (
    taskId        INT PRIMARY KEY,
    description   VARCHAR(255),
    isRecurring   BOOLEAN DEFAULT FALSE,
    snooze        BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_personal_task
        FOREIGN KEY (taskId) REFERENCES Task(taskId)
        ON DELETE CASCADE
);


CREATE TABLE Clubs (
    taskId              INT PRIMARY KEY,
    clubName            VARCHAR(100),
    responsibilityType  VARCHAR(100),
    CONSTRAINT fk_clubs_task
        FOREIGN KEY (taskId) REFERENCES Task(taskId)
        ON DELETE CASCADE
);


CREATE TABLE Assignment (
    taskId        INT PRIMARY KEY,
    subjectName   VARCHAR(100),
    CONSTRAINT fk_assignment_task
        FOREIGN KEY (taskId) REFERENCES Task(taskId)
        ON DELETE CASCADE
);

SELECT * FROM task;

INSERT INTO Student (userName, email, password)
VALUES ('kavindu99', 'kavindu@uni.lk', 'hashed_pw_1');

INSERT INTO Task (taskName, date, time, taskType, studentId)
VALUES ('Submit DB Assignment', '2026-08-01', '23:59:00', 'Assignment', 1);

INSERT INTO Assignment (taskId, subjectName)
VALUES (1, 'Database Systems');
