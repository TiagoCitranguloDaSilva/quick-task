package br.com.quick_task.integration;

import br.com.quick_task.request.Auth.AuthLoginRequestBody;
import br.com.quick_task.request.Auth.AuthRegisterRequestBody;
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
@DisplayName("Test: testing all endpoints of '/auth'")
public class AuthControllerIT {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    @DisplayName("Test: endpoint '/register'")
    void createNewUser_ReturnMessage_WhenSuccessful() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AuthRegisterRequestBody> entity = new HttpEntity<>(
                AuthRegisterRequestBody.builder()
                        .email("mockEmail@email.com")
                        .username("mockUsername")
                        .password("mockPassword")
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/auth/register",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Assertions.assertThat(response.getBody()).isEqualTo("User created");

    }

    @Test
    @DisplayName("Test: endpoint '/register' when send an invalid register request body")
    void createNewUser_ReturnError_WhenSendAnInvalidRegisterRequestBody() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AuthRegisterRequestBody> entity = new HttpEntity<>(
                AuthRegisterRequestBody.builder()
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/auth/register",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

    }

    @Test
    @DisplayName("Test: endpoint '/login'")
    void login_ReturnToken_WhenSuccessful() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AuthLoginRequestBody> entity = new HttpEntity<>(
                AuthLoginRequestBody.builder()
                        .email("mockEmail@email.com")
                        .password("mockPassword")
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/auth/login",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Assertions.assertThat(response.getBody()).isEqualTo("JWT Token Mock");

    }

    @Test
    @DisplayName("Test: endpoint '/login' when send an invalid login request body")
    void login_ReturnError_WhenSendAnInvalidLoginRequestBody() {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AuthLoginRequestBody> entity = new HttpEntity<>(
                AuthLoginRequestBody.builder()
                        .build(),
                header
        );

        ResponseEntity<String> response = testRestTemplate.exchange(
                "/auth/login",
                HttpMethod.POST,
                entity,
                String.class
        );

        Assertions.assertThat(response).isNotNull();

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

    }


}
