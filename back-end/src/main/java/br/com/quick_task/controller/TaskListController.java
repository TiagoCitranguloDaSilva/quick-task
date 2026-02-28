package br.com.quick_task.controller;

import br.com.quick_task.model.TaskList;
import br.com.quick_task.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/list")
@CrossOrigin(origins = "*")
public class TaskListController {

    @GetMapping
    public ResponseEntity<List<TaskList>> getAllLists() {

        TaskList list = TaskList.builder()
                .id(1L)
                .title("mockList")
                .description("mockListDescription")
                .user(User.builder().build())
                .tasks(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(List.of(list));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewList(TaskList list) {

        return ResponseEntity.status(HttpStatus.CREATED).body("List created");

    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskList> getListById(@PathVariable Long id) {

        TaskList list = TaskList.builder()
                .id(id)
                .title("mockList")
                .description("mockListDescription")
                .user(User.builder().build())
                .tasks(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(list);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> updateList(TaskList taskList, @PathVariable Long id) {

        return ResponseEntity.ok("List updated");

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteList(@PathVariable Long id) {

        return ResponseEntity.ok("List deleted");

    }

}
