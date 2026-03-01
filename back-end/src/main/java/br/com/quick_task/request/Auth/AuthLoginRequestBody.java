package br.com.quick_task.request.Auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AuthLoginRequestBody {

    @NotEmpty(message = "Email is required")
    @Email(message = "Invalid email")
    @Schema(example = "bestUser24@email.com")
    private String email;

    @NotEmpty(message = "Password is required")
    @Schema(example = "password123")
    private String password;

}
