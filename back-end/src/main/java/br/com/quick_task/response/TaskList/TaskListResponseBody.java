package br.com.quick_task.response.TaskList;

import br.com.quick_task.response.List.TaskResponseBody;
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

    private Long id;
    private String title;
    private String description;
    private List<TaskResponseBody> tasks;

}
