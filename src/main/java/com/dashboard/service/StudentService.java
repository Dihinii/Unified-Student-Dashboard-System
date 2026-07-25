package com.dashboard.service;

import com.dashboard.model.Student;
import com.dashboard.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student saveStudent(Student student) {

        return studentRepository.save(student);
    }

    public Student getStudentById(int id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student login(String userName, String password) {
        return studentRepository.findByUserNameAndPassword(userName, password);
    }
}