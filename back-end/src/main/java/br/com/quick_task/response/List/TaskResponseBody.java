package br.com.quick_task.response.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskResponseBody {

    private Long id;

    private String content;

    private Long listId;

}
