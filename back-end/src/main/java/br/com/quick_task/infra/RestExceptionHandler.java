package br.com.quick_task.infra;

import br.com.quick_task.exception.TaskListNotFoundException;
import br.com.quick_task.exception.TaskNotFoundException;
import br.com.quick_task.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    private ResponseEntity<RestErrorMessage> userNotFoundExceptionHandler(RuntimeException exception) {
        RestErrorMessage response = new RestErrorMessage(exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TaskListNotFoundException.class)
    private ResponseEntity<RestErrorMessage> taskListNotFoundExceptionHandler(RuntimeException exception) {
        RestErrorMessage response = new RestErrorMessage(exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TaskNotFoundException.class)
    private ResponseEntity<RestErrorMessage> taskNotFoundExceptionHandler(RuntimeException exception) {
        RestErrorMessage response = new RestErrorMessage(exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

}
