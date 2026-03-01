package br.com.quick_task.controller;

import br.com.quick_task.model.Task;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
public class TaskController {

    @PostMapping("/create")
    public ResponseEntity<String> createNewTask(Task task) {
        return ResponseEntity.status(HttpStatus.CREATED).body("Task created");
    }

    @PutMapping("/edit")
    public ResponseEntity<String> updateTask(Task task) {
        return ResponseEntity.ok("Task updated");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        return ResponseEntity.ok("Task deleted");
    }

}
