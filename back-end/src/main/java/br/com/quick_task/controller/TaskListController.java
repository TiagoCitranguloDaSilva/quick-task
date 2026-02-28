package br.com.quick_task.controller;

import br.com.quick_task.request.TaskList.TaskListPostRequestBody;
import br.com.quick_task.request.TaskList.TaskListPutRequestBody;
import br.com.quick_task.response.TaskList.TaskListResponseBody;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/list")
public class TaskListController {

    @GetMapping
    public ResponseEntity<List<TaskListResponseBody>> getAllLists() {

        TaskListResponseBody list = TaskListResponseBody.builder()
                .id(1L)
                .title("mockList")
                .description("mockListDescription")
                .tasks(new ArrayList<>())
                .build();

        return ResponseEntity.ok(List.of(list));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewList(@RequestBody @Valid TaskListPostRequestBody request) {

        return ResponseEntity.status(HttpStatus.CREATED).body("List created");

    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskListResponseBody> getListById(@PathVariable Long id) {

        TaskListResponseBody list = TaskListResponseBody.builder()
                .id(id)
                .title("mockList")
                .description("mockListDescription")
                .tasks(new ArrayList<>())
                .build();

        return ResponseEntity.ok(list);
    }

    @PutMapping("/edit")
    public ResponseEntity<String> updateList(@RequestBody @Valid TaskListPutRequestBody request) {

        return ResponseEntity.ok("List updated");

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteList(@PathVariable Long id) {

        return ResponseEntity.ok("List deleted");

    }

}
