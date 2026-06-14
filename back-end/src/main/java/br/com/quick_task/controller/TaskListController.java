package br.com.quick_task.controller;

import br.com.quick_task.model.User;
import br.com.quick_task.request.TaskList.TaskListPostRequestBody;
import br.com.quick_task.request.TaskList.TaskListPutRequestBody;
import br.com.quick_task.response.TaskList.TaskListResponseBody;
import br.com.quick_task.service.TaskListService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/list")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<TaskListResponseBody>> getAllLists(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskListService.findAllLists(user.getId()));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewList(@RequestBody @Valid TaskListPostRequestBody request, @AuthenticationPrincipal User user) {

        TaskListResponseBody taskList = taskListService.createList(request, user.getId());

        if (taskList == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("List created");

    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskListResponseBody> getListById(@PathVariable Long id, @AuthenticationPrincipal User user) {

        TaskListResponseBody list = taskListService.findById(id, user.getId());

        if (list == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(list);
    }

    @PutMapping("/edit")
    public ResponseEntity<String> updateList(@RequestBody @Valid TaskListPutRequestBody request, @AuthenticationPrincipal User user) {

        TaskListResponseBody list = taskListService.update(request, user.getId());

        if (list == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
        }

        return ResponseEntity.ok("List updated");

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteList(@PathVariable Long id, @AuthenticationPrincipal User user) {

        taskListService.delete(id, user.getId());

        return ResponseEntity.ok("List deleted");

    }

}
