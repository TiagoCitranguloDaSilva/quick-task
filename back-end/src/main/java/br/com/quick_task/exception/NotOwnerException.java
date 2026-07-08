package br.com.quick_task.exception;

import br.com.quick_task.model.Task;
import br.com.quick_task.model.TaskList;

public class NotOwnerException extends RuntimeException {

    public NotOwnerException(Task task) {
        throw new TaskNotFoundException(task.getId());
    }

    public NotOwnerException(TaskList list) {
        throw new TaskListNotFoundException(list.getId());
    }

}
