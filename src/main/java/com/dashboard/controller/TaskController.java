package com.dashboard.controller;

import com.dashboard.model.Task;
import com.dashboard.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/add")
    public Task addTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> markTaskAsComplete(@PathVariable int id) {
        taskService.markTaskAsComplete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable int id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}")
    public List<Task> getTasksByStudentId(@PathVariable int studentId) {
        return taskService.getTasksByStudentId(studentId);
    }
}