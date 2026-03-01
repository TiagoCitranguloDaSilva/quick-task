package br.com.quick_task.controller;

import br.com.quick_task.request.Task.TaskPostRequestBody;
import br.com.quick_task.request.Task.TaskPutRequestBody;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
public class TaskController {

    @PostMapping("/create")
    public ResponseEntity<String> createNewTask(@RequestBody @Valid TaskPostRequestBody request) {
        return ResponseEntity.status(HttpStatus.CREATED).body("Task created");
    }

    @PutMapping("/edit")
    public ResponseEntity<String> updateTask(@RequestBody @Valid TaskPutRequestBody request) {
        return ResponseEntity.ok("Task updated");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        return ResponseEntity.ok("Task deleted");
    }

}
