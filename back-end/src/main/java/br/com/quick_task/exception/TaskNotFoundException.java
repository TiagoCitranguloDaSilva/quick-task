package br.com.quick_task.exception;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException() {
        super("Task not found");
    }

    public TaskNotFoundException(Long id) {
        super("Task with id " + id + " not found");
    }

    public TaskNotFoundException(String message) {
        super(message);
    }

}
