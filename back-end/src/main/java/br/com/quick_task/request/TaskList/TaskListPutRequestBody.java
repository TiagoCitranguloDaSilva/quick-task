package br.com.quick_task.request.TaskList;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
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
public class TaskListPutRequestBody {

    @NotNull(message = "ID is required")
    @Min(value = 1L, message = "ID must be greater than 0")
    @Schema(example = "1")
    private Long id;

    // It's temporary
    @NotNull(message = "User id is required")
    @Schema(example = "1L")
    private Long userId;

    @NotBlank(message = "Title is required")
    @Schema(example = "Home")
    private String title;

    @Schema(nullable = true, example = "A list of all my chores")
    private String description;

}
