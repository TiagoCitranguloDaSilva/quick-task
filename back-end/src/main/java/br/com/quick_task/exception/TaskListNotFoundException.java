package br.com.quick_task.exception;

public class TaskListNotFoundException extends RuntimeException {

    public TaskListNotFoundException() {
        super("Task list not found");
    }

    public TaskListNotFoundException(Long id) {
        super("Task list with id " + id + " not found");
    }

    public TaskListNotFoundException(String message) {
        super(message);
    }

}
