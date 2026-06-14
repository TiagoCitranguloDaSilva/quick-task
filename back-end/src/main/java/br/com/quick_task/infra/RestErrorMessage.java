package br.com.quick_task.infra;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RestErrorMessage {

    private LocalDateTime timestamp;
    private String message;

    public RestErrorMessage(String message) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
    }

}
