package br.com.quick_task.request.Task;

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
    private Long id;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "List ID is required")
    private Long listId;

}
