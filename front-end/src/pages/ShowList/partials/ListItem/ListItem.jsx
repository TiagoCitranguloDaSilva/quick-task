import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ListItem.module.css";
import { CircleX, LoaderCircle, Pen, Save, Trash } from "lucide-react";
import useApi from "../../../../hooks/useApi";

export default function ListItem({ currentTask }) {
  const { fetchWithAuth } = useApi();

  const [task, setTask] = useState(currentTask);

  const mountedRef = useRef(true);
  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.content);
  const inputRef = useRef(null);
  const editButtonRef = useRef(null);
  const startedEditing = useRef(false);

  const requestUpdateItem = useCallback(async () => {
    setRequestStatus("loading");

    const data = {
      id: task.id,
      content: draft.trim(),
      listId: task.listId,
      done: false,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetchWithAuth("http://localhost:8080/task/edit", {
        method: "PUT",
        body: JSON.stringify(data),
        signal: controllerRef.current.signal,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      }

      // If still on the same screen update the data
      if (mountedRef.current) {
        setRequestStatus("idle");
        setIsEditing(false);
        setTask(data);
      }
    } catch (e) {
      // If still on the same screen show error on screen
      console.error(e);
      if (mountedRef.current) setRequestStatus("error");
    }
  }, [fetchWithAuth, draft, task]);

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

    // If it's empty just go back
    if (draft.trim() == "") return;

    // If the same values as before
    if (draft.trim() == task.content) {
      // Just go back to normal view mode
      setRequestStatus("idle");
      setIsEditing(false);
      return;
    }

    requestUpdateItem();
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

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // On unmount cancel fetch
      controllerRef.current.abort();
    };
  }, []);

  return (
    <div className={styles.items} htmlFor={task.id} data-error={requestStatus == "error"}>
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
            {requestStatus == "loading" ? (
              <LoaderCircle className={styles.loading} />
            ) : (
              <Save size={16} />
            )}
          </button>
        )}

        <button type="button" className="square destructive">
          <Trash size={16} />
        </button>
      </div>

      {requestStatus == "error" ? (
        <p className={`error ${styles.error}`}>
          An error ocurred
          <CircleX />
        </p>
      ) : null}
    </div>
  );
}
