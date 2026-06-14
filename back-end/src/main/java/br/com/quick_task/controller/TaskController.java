package br.com.quick_task.controller;

import br.com.quick_task.request.Task.TaskPostRequestBody;
import br.com.quick_task.request.Task.TaskPutRequestBody;
import br.com.quick_task.response.Task.TaskResponseBody;
import br.com.quick_task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewTask(@RequestBody @Valid TaskPostRequestBody request) {

        Optional<TaskResponseBody> response = taskService.createTask(request);

        if (response.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List not found");

        return ResponseEntity.status(HttpStatus.CREATED).body("Task created");
    }

    @PutMapping("/edit")
    public ResponseEntity<String> updateTask(@RequestBody @Valid TaskPutRequestBody request) {

        Optional<TaskResponseBody> response = taskService.updateTask(request);

        if (response.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok("Task updated");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {

        Optional<Long> response = taskService.deleteTask(id);

        if (response.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok("Task deleted");
    }

}
