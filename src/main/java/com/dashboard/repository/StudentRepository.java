package com.dashboard.repository;

import com.dashboard.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // Meke <Student, Integer> kiyanne, meka Student entity ekata adala repository ekak, 
    // saha eke Primary key eka (studentId) Integer ekak kiyana eka.
    
    Student findByUserNameAndPassword(String userName, String password);
}