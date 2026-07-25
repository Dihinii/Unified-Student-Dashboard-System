package com.dashboard.service;

import com.dashboard.model.Task;
import com.dashboard.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void markTaskAsComplete(int taskId) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task != null) {
            task.setIsCompleted(true);
            taskRepository.save(task);
        }
    }

    public void deleteTask(int taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<Task> getTasksByStudentId(int studentId) {
        return taskRepository.findByStudent_StudentId(studentId);
    }
}