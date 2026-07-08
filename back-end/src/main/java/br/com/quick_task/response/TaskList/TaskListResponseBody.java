package br.com.quick_task.response.TaskList;

import br.com.quick_task.response.Task.TaskResponseBody;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class TaskListResponseBody {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "School")
    private String title;

    @Schema(nullable = true, example = "A list of all my school tasks")
    private String description;

    private List<TaskResponseBody> tasks;

}
