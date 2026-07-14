import { CircleX, Ellipsis, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import styles from "./List.module.css";
import Item from "./partials/Item/Item";

export default function List({ list, openEditList, openDeleteList }) {
  const [requestStatus, setRequestStatus] = useState("idle");

  const listTasksLimited = list.tasks.slice(0, 10);
  const numberOfTasksHidden = list.tasks.length - 10;

  const descriptionSplit = list.description.split("\n");
  const description =
    descriptionSplit.slice(0, 4).join("\n") + (descriptionSplit.length > 4 ? "\n..." : "");

  function handleEditButton(e) {
    e.preventDefault();
    e.stopPropagation();
    openEditList(list);
  }

  function handleDeleteButton(e) {
    e.preventDefault();
    e.stopPropagation();
    openDeleteList(list);
  }

  return (
    <Link to={`/list/${list.id}`} className={styles.list} data-no-default="true">
      <p className={styles.list_title}>{list.title}</p>
      <p className={styles.list_description}>{description}</p>

      <div className={styles.list_items} data-has-tasks={list.tasks.length > 0}>
        {listTasksLimited?.map((task) => {
          const inputId = `task_${list.id}_${task.id}`;

          return (
            <Item
              className={styles.list_item}
              key={inputId}
              inputId={inputId}
              task={task}
              setRequestStatus={setRequestStatus}
            />
          );
        })}

        {requestStatus == "error" ? (
          <p className={`error ${styles.error}`}>
            <CircleX />
            An error ocurred
          </p>
        ) : null}
      </div>

      <div className={styles.button_actions}>
        {list.tasks.length > 10 ? (
          <p className={styles.list_hidden}>
            <Ellipsis />
            {numberOfTasksHidden} task{numberOfTasksHidden > 1 ? "s" : null} hidden
          </p>
        ) : null}

        <div className={styles.button_actions_buttons}>
          <button type="button" className="square" onClick={handleEditButton}>
            <SquarePen size={16} />
          </button>

          <button type="button" className="square destructive" onClick={handleDeleteButton}>
            <Trash size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
