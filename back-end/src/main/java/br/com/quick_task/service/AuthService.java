package br.com.quick_task.service;

import br.com.quick_task.model.User;
import br.com.quick_task.repository.UserRepository;
import br.com.quick_task.request.Auth.AuthLoginRequestBody;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User validateLogin(AuthLoginRequestBody request) {

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isEmpty()) {
            return null;
        }

        if (!passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            return null;
        }

        return user.get();
    }

}
