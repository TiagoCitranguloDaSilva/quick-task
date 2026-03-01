package br.com.quick_task.request.TaskList;

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
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

}
