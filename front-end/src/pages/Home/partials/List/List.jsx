import { Link } from "react-router";

import styles from "./List.module.css";
import { SquarePen, Trash } from "lucide-react";

export default function List({ list }) {
  const listTasksLimited = list.tasks.slice(0, 10);

  function handleEditButton(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDeleteButton(e) {
    e.preventDefault();
    e.stopPropagation();
  }

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

      <div className={styles.button_actions}>
        <button type="button" className="square" onClick={handleEditButton}>
          <SquarePen size={16} />
        </button>

        <button type="button" className="square destructive" onClick={handleDeleteButton}>
          <Trash size={16} />
        </button>
      </div>
    </Link>
  );
}
