import { Link } from "react-router";

import styles from "./List.module.css";

export default function List({ list }) {
  console.log(list);

  const listTasksLimited = list.tasks.slice(0, 4);

  return (
    <Link
      to={`/list/${list.id}`}
      key={`list_${list.id}`}
      className={styles.list}
      data-no-default="true"
    >
      <p className={styles.list_tittle}>{list.title}</p>
      <p className={styles.list_description}>{list.description}</p>

      <div className={styles.list_items}>
        {listTasksLimited?.map((task) => (
          <span className={styles.list_item} key={`list_${list.id}_item_${task.id}`}>
            <input type="checkbox" />
            <span>{task.content}</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
