package br.com.quick_task.service;

import br.com.quick_task.model.Task;
import br.com.quick_task.model.TaskList;
import br.com.quick_task.model.User;
import br.com.quick_task.repository.TaskListRepository;
import br.com.quick_task.repository.TaskRepository;
import br.com.quick_task.repository.UserRepository;
import br.com.quick_task.request.Task.TaskPostRequestBody;
import br.com.quick_task.request.Task.TaskPutRequestBody;
import br.com.quick_task.response.Task.TaskResponseBody;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, TaskListRepository taskListRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
        this.userRepository = userRepository;
    }

    public Optional<TaskResponseBody> createTask(TaskPostRequestBody request, Long userId) {

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Optional.empty();

        Optional<TaskList> list = taskListRepository.findById(request.getListId());
        if (list.isEmpty()) return Optional.empty();

        if (!list.get().getUser().equals(userOpt.get())) return Optional.empty();

        Task task = Task.builder()
                .content(request.getContent())
                .list(list.get())
                .build();

        return Optional.of(convertToDTO(taskRepository.save(task)));

    }

    public Optional<TaskResponseBody> updateTask(TaskPutRequestBody request, Long userId) {

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Optional.empty();

        Optional<Task> taskOpt = taskRepository.findById(request.getId());

        if (taskOpt.isEmpty()) return Optional.empty();

        Optional<TaskList> taskListOpt = taskListRepository.findById(request.getListId());

        if (taskListOpt.isEmpty()) return Optional.empty();

        if (!taskListOpt.get().getUser().equals(userOpt.get())) return Optional.empty();

        Task task = taskOpt.get();

        task.setContent(request.getContent());
        task.setList(taskListOpt.get());

        return Optional.of(convertToDTO(taskRepository.save(task)));

    }

    public Optional<Long> deleteTask(Long id, Long userId) {

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Optional.empty();

        Optional<Task> taskOpt = taskRepository.findById(id);

        if (taskOpt.isEmpty()) return Optional.empty();

        Optional<TaskList> taskListOpt = taskListRepository.findById(taskOpt.get().getList().getId());
        if (taskListOpt.isEmpty()) return Optional.empty();

        if (!taskListOpt.get().getUser().equals(userOpt.get())) return Optional.empty();

        Task task = taskOpt.get();

        TaskList taskList = taskListOpt.get();

        taskList.getTasks().remove(task);

        taskRepository.delete(task);
        return Optional.of(task.getId());

    }

    private TaskResponseBody convertToDTO(Task task) {
        return TaskResponseBody.builder()
                .id(task.getId())
                .content(task.getContent())
                .listId(task.getList().getId())
                .build();
    }

}
