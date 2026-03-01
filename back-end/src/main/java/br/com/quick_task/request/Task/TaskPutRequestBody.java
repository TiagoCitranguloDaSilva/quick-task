package br.com.quick_task.request.Task;

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
@Data
@Builder
public class TaskPutRequestBody {

    @NotNull(message = "ID is required")
    @Min(value = 1L, message = "ID must be greater than 0")
    @Schema(example = "1")
    private Long id;

    @NotBlank(message = "Content is required")
    @Schema(example = "Do homework")
    private String content;

    @NotNull(message = "List ID is required")
    @Min(value = 1L, message = "List ID must be greater than 0")
    @Schema(example = "1")
    private Long listId;

}
