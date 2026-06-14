package br.com.quick_task.service;

import br.com.quick_task.exception.UserAlreadyExistsException;
import br.com.quick_task.model.User;
import br.com.quick_task.repository.UserRepository;
import br.com.quick_task.request.Auth.AuthRegisterRequestBody;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createNewUser(AuthRegisterRequestBody request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new UserAlreadyExistsException();

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return user;

    }

}
