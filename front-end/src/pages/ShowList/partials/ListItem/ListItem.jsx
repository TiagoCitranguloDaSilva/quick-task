import { useEffect, useRef, useState } from "react";
import styles from "./ListItem.module.css";
import { Pen, Save, Trash } from "lucide-react";

export default function ListItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.content);
  const inputRef = useRef(null);
  const editButtonRef = useRef(null);
  const startedEditing = useRef(false);

  function handleStartEditing(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    startedEditing.current = true;

    setIsEditing(true);
    setDraft(task.content);
  }

  function handleSaveEditing(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    console.log(`FROM ${task.content} TO ${draft}`);
    setIsEditing(false);
  }

  function handleKeyUp(e) {
    if (startedEditing.current) {
      startedEditing.current = false;
      return;
    }

    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (e.key == "Enter") {
      handleSaveEditing();
    } else if (e.key == "Escape") {
      cancelEditing();
    }
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  useEffect(() => {
    // If it's now editing
    if (isEditing) {
      // Focous on the field of the content of the item
      inputRef?.current?.focus();
    } else {
      // Focus back on the edit button
      editButtonRef?.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className={styles.items} htmlFor={task.id}>
      <label className={styles.content}>
        <input type="checkbox" id={task.id} />

        {!isEditing ? (
          <span onDoubleClick={handleStartEditing}>{task.content}</span>
        ) : (
          <input
            className={styles.content_input}
            onChange={(e) => setDraft(e.target.value)}
            value={draft}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        )}
      </label>

      <div className={styles.actions}>
        {!isEditing ? (
          <button type="button" className="square" onClick={handleStartEditing} ref={editButtonRef}>
            <Pen size={16} />
          </button>
        ) : (
          <button type="button" className="square" onClick={handleSaveEditing}>
            <Save size={16} />
          </button>
        )}

        <button type="button" className="square destructive">
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}
