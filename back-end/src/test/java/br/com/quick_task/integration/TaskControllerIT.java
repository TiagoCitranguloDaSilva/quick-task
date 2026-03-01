package br.com.quick_task.integration;

import br.com.quick_task.request.Task.TaskPostRequestBody;
import br.com.quick_task.request.Task.TaskPutRequestBody;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase
@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Test: testing all endpoints of '/task'")
public class TaskControllerIT {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    @DisplayName("Test: endpoint '/create'")
    void createNewTask_ReturnMessage_WhenSuccessful() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TaskPostRequestBody> entity = new HttpEntity<>(
                TaskPostRequestBody.builder()
                        .content("mockTask")
                        .listId(1L)
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/task/create",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Assertions.assertThat(response.getBody()).isEqualTo("Task created");

    }

    @Test
    @DisplayName("Test: endpoint '/create' when send an invalid post request body")
    void createNewTask_ReturnError_WhenSendAnInvalidRequestBody() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TaskPostRequestBody> entity = new HttpEntity<>(
                TaskPostRequestBody.builder()
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/task/create",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

    }

    @Test
    @DisplayName("Test: endpoint '/edit'")
    void updateTask_ReturnMessage_WhenSuccessful() {


        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TaskPutRequestBody> entity = new HttpEntity<>(
                TaskPutRequestBody.builder()
                        .id(1L)
                        .content("mockUpdatedTask")
                        .listId(1L)
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/task/edit",
                HttpMethod.PUT,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo("Task updated");

    }

    @Test
    @DisplayName("Test: endpoint '/delete/{id}'")
    void deleteTask_ReturnMessage_WhenSuccessful() {

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/task/delete/{id}",
                HttpMethod.DELETE,
                null,
                String.class,
                1L
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo("Task deleted");

    }

}
