package br.com.quick_task.controller;

import br.com.quick_task.request.TaskList.TaskListPostRequestBody;
import br.com.quick_task.request.TaskList.TaskListPutRequestBody;
import br.com.quick_task.response.TaskList.TaskListResponseBody;
import br.com.quick_task.service.TaskListService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/list")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("/all/{id}")
    public ResponseEntity<List<TaskListResponseBody>> getAllLists(@PathVariable Long id) {
        return ResponseEntity.ok(taskListService.findAllLists(id));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewList(@RequestBody @Valid TaskListPostRequestBody request) {
        TaskListResponseBody taskList = taskListService.createList(request);

        if (taskList == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("List created");

    }

    @GetMapping("/{id}/{userId}")
    public ResponseEntity<TaskListResponseBody> getListById(@PathVariable Long id, @PathVariable Long userId) {

        TaskListResponseBody list = taskListService.findById(id, userId);

        if (list == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(list);
    }

    @PutMapping("/edit")
    public ResponseEntity<String> updateList(@RequestBody @Valid TaskListPutRequestBody request) {

        TaskListResponseBody list = taskListService.update(request);

        if (list == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
        }

        return ResponseEntity.ok("List updated");

    }

    @DeleteMapping("/delete/{id}/{userId}")
    public ResponseEntity<String> deleteList(@PathVariable Long id, @PathVariable Long userId) {

        taskListService.delete(id, userId);

        return ResponseEntity.ok("List deleted");

    }

}
