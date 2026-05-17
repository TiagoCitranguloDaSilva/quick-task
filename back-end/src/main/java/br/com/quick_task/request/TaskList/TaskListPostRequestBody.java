package br.com.quick_task.request.TaskList;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class TaskListPostRequestBody {

    // It's temporary
    @NotNull(message = "User id is required")
    @Schema(example = "1L")
    private Long userId;

    @NotBlank(message = "Title is required")
    @Schema(example = "School")
    private String title;

    @Schema(nullable = true, example = "A list of all my school tasks")
    private String description;

}
