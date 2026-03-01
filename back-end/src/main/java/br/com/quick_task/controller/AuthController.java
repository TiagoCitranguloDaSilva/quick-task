package br.com.quick_task.controller;

import br.com.quick_task.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/create")
    public ResponseEntity<String> createNewUser(User user) {

        return ResponseEntity.status(HttpStatus.CREATED).body("User created");

    }

    @PostMapping("/login")
    public ResponseEntity<String> login(User user) {

        return ResponseEntity.ok("JTW Token Mock");

    }

}
