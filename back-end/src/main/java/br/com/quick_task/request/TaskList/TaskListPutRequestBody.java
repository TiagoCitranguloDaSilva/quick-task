package br.com.quick_task.request.TaskList;

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
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

}
