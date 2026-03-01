package br.com.quick_task.controller;

import br.com.quick_task.request.Auth.AuthLoginRequestBody;
import br.com.quick_task.request.Auth.AuthRegisterRequestBody;
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

    @PostMapping("/register")
    public ResponseEntity<String> createNewUser(@RequestBody @Valid AuthRegisterRequestBody request) {

        return ResponseEntity.status(HttpStatus.CREATED).body("User created");

    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid AuthLoginRequestBody request) {

        return ResponseEntity.ok("JWT Token Mock");

    }

}
