package br.com.quick_task.service;

import br.com.quick_task.model.TaskList;
import br.com.quick_task.model.User;
import br.com.quick_task.repository.TaskListRepository;
import br.com.quick_task.repository.UserRepository;
import br.com.quick_task.request.TaskList.TaskListPostRequestBody;
import br.com.quick_task.request.TaskList.TaskListPutRequestBody;
import br.com.quick_task.response.Task.TaskResponseBody;
import br.com.quick_task.response.TaskList.TaskListResponseBody;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TaskListService {

    private final TaskListRepository taskListRepository;

    private final UserRepository userRepository;

    public TaskListService(TaskListRepository taskListRepository, UserRepository userRepository) {
        this.taskListRepository = taskListRepository;
        this.userRepository = userRepository;
    }

    public List<TaskListResponseBody> findAllLists(Long id) {

        List<TaskListResponseBody> list = new ArrayList<>();

        taskListRepository.findByUserId(id).forEach(taskList -> {
            list.add(convertToDTO(taskList));
        });

        return list;
    }

    public TaskListResponseBody createList(TaskListPostRequestBody request) {

        Optional<User> user = userRepository.findById(request.getUserId());

        if (user.isEmpty()) {
            return null;
        }

        TaskList taskList = TaskList.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user.get())
                .tasks(new ArrayList<>())
                .build();

        taskListRepository.save(taskList);

        return convertToDTO(taskList);
    }

    public TaskListResponseBody findById(Long taskId, Long userId) {

        Optional<TaskList> list = taskListRepository.findById(taskId);

        if (list.isEmpty()) {
            return null;
        }

        if (!list.get().getUser().getId().equals(userId)) {
            return null;
        }

        return convertToDTO(list.get());

    }

    public TaskListResponseBody update(TaskListPutRequestBody request) {

        Optional<TaskList> list = taskListRepository.findById(request.getId());

        if (list.isEmpty()) {
            return null;
        }

        if (!list.get().getUser().getId().equals(request.getUserId())) {
            return null;
        }

        list.get().setTitle(request.getTitle());
        list.get().setDescription(request.getDescription());

        taskListRepository.save(list.get());

        return convertToDTO(list.get());

    }

    public void delete(Long taskListId, Long userId) {

        Optional<TaskList> list = taskListRepository.findById(taskListId);

        if (list.isEmpty()) {
            return;
        }

        if (!list.get().getUser().getId().equals(userId)) {
            return;
        }

        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) return;

        user.get().getLists().remove(list.get());

        taskListRepository.delete(list.get());

    }

    private TaskListResponseBody convertToDTO(TaskList taskList) {

        List<TaskResponseBody> tasks = new ArrayList<>();

        if (taskList.getTasks() != null) {
            taskList.getTasks().forEach(task -> {
                tasks.add(TaskResponseBody.builder()
                        .id(task.getId())
                        .content(task.getContent())
                        .listId(task.getList().getId())
                        .build());
            });
        }

        return TaskListResponseBody.builder()
                .id(taskList.getId())
                .title(taskList.getTitle())
                .description(taskList.getDescription())
                .tasks(tasks)
                .build();
    }


}
