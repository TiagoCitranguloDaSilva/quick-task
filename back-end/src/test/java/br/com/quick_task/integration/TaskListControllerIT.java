package br.com.quick_task.integration;

import br.com.quick_task.request.TaskList.TaskListPostRequestBody;
import br.com.quick_task.request.TaskList.TaskListPutRequestBody;
import br.com.quick_task.response.TaskList.TaskListResponseBody;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;

import java.util.ArrayList;
import java.util.List;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase
@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Test: testing all endpoints of '/list'")
public class TaskListControllerIT {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    @DisplayName("Test: endpoint '/'")
    void getAllLists_ReturnListOfTaskLists_WhenSuccessful() {

        TaskListResponseBody list = TaskListResponseBody.builder()
                .id(1L)
                .title("mockList")
                .description("mockListDescription")
                .tasks(new ArrayList<>())
                .build();

        ResponseEntity<List<TaskListResponseBody>> response = testRestTemplate.exchange(
                "/list",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo(List.of(list));

    }

    @Test
    @DisplayName("Test: endpoint '/create'")
    void createNewList_ReturnMessage_WhenSuccessful() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TaskListPostRequestBody> entity = new HttpEntity<>(
                TaskListPostRequestBody.builder()
                        .title("mockList")
                        .description("mockListDescription")
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/list/create",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Assertions.assertThat(response.getBody()).isEqualTo("List created");

    }

    @Test
    @DisplayName("Test: endpoint '/create' when send an invalid post request body")
    void createNewList_ReturnError_WhenSendAnInvalidRequestBody() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TaskListPostRequestBody> entity = new HttpEntity<>(
                TaskListPostRequestBody.builder()
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/list/create",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

    }

    @Test
    @DisplayName("Test: endpoint '/{id}'")
    void getListById_ReturnTaskList_WhenSuccessful() {

        TaskListResponseBody list = TaskListResponseBody.builder()
                .id(1L)
                .title("mockList")
                .description("mockListDescription")
                .tasks(new ArrayList<>())
                .build();

        ResponseEntity<TaskListResponseBody> response = testRestTemplate.exchange(
                "/list/{id}",
                HttpMethod.GET,
                null,
                TaskListResponseBody.class,
                1L
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo(list);

    }

    @Test
    @DisplayName("Test: endpoint '/edit'")
    void updateList_ReturnMessage_WhenSuccessful() {


        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TaskListPutRequestBody> entity = new HttpEntity<>(
                TaskListPutRequestBody.builder()
                        .id(1L)
                        .title("mockList")
                        .description("mockListDescription")
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/list/edit",
                HttpMethod.PUT,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo("List updated");

    }

    @Test
    @DisplayName("Test: endpoint '/delete/{id}'")
    void deleteList_ReturnMessage_WhenSuccessful() {

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/list/delete/{id}",
                HttpMethod.DELETE,
                null,
                String.class,
                1L
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo("List deleted");

    }

}
