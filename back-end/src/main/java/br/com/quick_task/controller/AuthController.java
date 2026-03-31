package br.com.quick_task.controller;

import br.com.quick_task.model.User;
import br.com.quick_task.request.Auth.AuthLoginRequestBody;
import br.com.quick_task.request.Auth.AuthRegisterRequestBody;
import br.com.quick_task.service.AuthService;
import br.com.quick_task.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> createNewUser(@RequestBody @Valid AuthRegisterRequestBody request) {
        User user = userService.createNewUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("User created");

    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid AuthLoginRequestBody request) {

        User user = authService.validateLogin(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect credentials");
        }

        return ResponseEntity.ok("JWT Token Mock");

    }

}
