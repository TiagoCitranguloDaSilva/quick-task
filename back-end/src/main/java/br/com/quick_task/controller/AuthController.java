package br.com.quick_task.controller;

import br.com.quick_task.model.User;
import br.com.quick_task.request.Auth.AuthLoginRequestBody;
import br.com.quick_task.request.Auth.AuthRegisterRequestBody;
import br.com.quick_task.service.TokenService;
import br.com.quick_task.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    private final TokenService tokenService;

    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, TokenService tokenService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
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

        UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );

        Authentication auth = authenticationManager.authenticate(usernamePassword);

        if (auth.getPrincipal() == null) return null;

        String token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok("Bearer " + token);

    }

}
