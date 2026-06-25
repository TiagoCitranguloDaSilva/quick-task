package br.com.quick_task.service;

import br.com.quick_task.exception.NotOwnerException;
import br.com.quick_task.exception.TaskListNotFoundException;
import br.com.quick_task.exception.TaskNotFoundException;
import br.com.quick_task.exception.UserNotFoundException;
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

    public TaskResponseBody createTask(TaskPostRequestBody request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        TaskList list = taskListRepository.findById(request.getListId())
                .orElseThrow(() -> new TaskListNotFoundException(request.getListId()));

        if (!list.getUser().equals(user))
            throw new NotOwnerException(list);

        Task task = Task.builder()
                .content(request.getContent())
                .list(list)
                .isDone(request.isDone())
                .build();

        return convertToDTO(taskRepository.save(task));

    }

    public TaskResponseBody updateTask(TaskPutRequestBody request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Task task = taskRepository.findById(request.getId())
                .orElseThrow(() -> new TaskNotFoundException(request.getId()));

        TaskList taskList = taskListRepository.findById(request.getListId())
                .orElseThrow(() -> new TaskListNotFoundException(request.getListId()));

        if (!taskList.getUser().equals(user))
            throw new NotOwnerException(task);

        task.setContent(request.getContent());
        task.setList(taskList);
        task.setDone(request.isDone());

        return convertToDTO(taskRepository.save(task));

    }

    public void deleteTask(Long id, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        TaskList taskList = taskListRepository.findById(task.getList().getId())
                .orElseThrow(() -> new TaskNotFoundException(task.getList().getId()));

        if (!taskList.getUser().equals(user))
            throw new NotOwnerException(task);

        taskList.getTasks().remove(task);
        taskRepository.delete(task);

    }

    private TaskResponseBody convertToDTO(Task task) {
        return TaskResponseBody.builder()
                .id(task.getId())
                .content(task.getContent())
                .listId(task.getList().getId())
                .done(task.isDone())
                .build();
    }

}
