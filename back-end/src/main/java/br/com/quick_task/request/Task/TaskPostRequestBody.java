package br.com.quick_task.request.Task;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskPostRequestBody {

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "List ID is required")
    @Min(value = 1L, message = "List ID must be greater than 0")
    private Long listId;

}
