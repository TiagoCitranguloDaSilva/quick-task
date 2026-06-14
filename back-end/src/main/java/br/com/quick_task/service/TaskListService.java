package br.com.quick_task.service;

import br.com.quick_task.exception.NotOwnerException;
import br.com.quick_task.exception.TaskListNotFoundException;
import br.com.quick_task.exception.UserNotFoundException;
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

@Service
public class TaskListService {

    private final TaskListRepository taskListRepository;

    private final UserRepository userRepository;

    public TaskListService(TaskListRepository taskListRepository, UserRepository userRepository) {
        this.taskListRepository = taskListRepository;
        this.userRepository = userRepository;
    }

    public List<TaskListResponseBody> findAllLists(Long id) {

        userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        List<TaskListResponseBody> list = new ArrayList<>();

        taskListRepository.findByUserId(id).forEach(taskList -> {
            list.add(convertToDTO(taskList));
        });

        return list;
    }

    public TaskListResponseBody createList(TaskListPostRequestBody request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));


        TaskList taskList = TaskList.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user)
                .tasks(new ArrayList<>())
                .build();

        taskListRepository.save(taskList);

        return convertToDTO(taskList);
    }

    public TaskListResponseBody findById(Long taskId, Long userId) {

        TaskList list = taskListRepository.findById(taskId)
                .orElseThrow(() -> new TaskListNotFoundException(taskId));


        if (!list.getUser().getId().equals(userId))
            throw new NotOwnerException(list);

        return convertToDTO(list);

    }

    public TaskListResponseBody update(TaskListPutRequestBody request, Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        TaskList list = taskListRepository.findById(request.getId())
                .orElseThrow(() -> new TaskListNotFoundException(request.getId()));

        if (!list.getUser().getId().equals(userId))
            throw new NotOwnerException(list);

        list.setTitle(request.getTitle());
        list.setDescription(request.getDescription());

        taskListRepository.save(list);

        return convertToDTO(list);

    }

    public void delete(Long taskListId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        TaskList list = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new TaskListNotFoundException(taskListId));


        if (!list.getUser().getId().equals(userId))
            throw new NotOwnerException(list);

        user.getLists().remove(list);

        taskListRepository.delete(list);

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
