import { Link } from "react-router";

import styles from "./List.module.css";

export default function List({ list }) {
  const listTasksLimited = list.tasks.slice(0, 4);

  return (
    <Link to={`/list/${list.id}`} className={styles.list} data-no-default="true">
      <p className={styles.list_title}>{list.title}</p>
      <p className={styles.list_description}>{list.description}</p>

      <div className={styles.list_items}>
        {listTasksLimited?.map((task) => {
          const inputId = `task_${list.id}_${task.id}`;

          return (
            <div className={styles.list_item} key={inputId}>
              <input type="checkbox" id={inputId} onClick={(e) => e.stopPropagation()} />
              <label htmlFor={inputId}>{task.content}</label>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
