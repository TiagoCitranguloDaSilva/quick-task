package br.com.quick_task.response.Task;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskResponseBody {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "Do homework")
    private String content;

    @Schema(example = "1")
    private Long listId;

    @Schema(example = "false")
    private boolean done;

}
