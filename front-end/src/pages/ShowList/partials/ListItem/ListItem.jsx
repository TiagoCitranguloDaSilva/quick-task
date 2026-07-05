import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ListItem.module.css";
import { CircleX, LoaderCircle, Pen, Save, Trash } from "lucide-react";
import useApi from "../../../../hooks/useApi";

export default function ListItem({ currentTask, onDelete }) {
  const { fetchWithAuth } = useApi();

  const [task, setTask] = useState(currentTask);
  const [checked, setChecked] = useState(task.done);

  const mountedRef = useRef(true);
  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.content);
  const inputRef = useRef(null);
  const editButtonRef = useRef(null);
  const startedEditing = useRef(false);

  const confirmDeleteTimeoutRef = useRef(null);
  const deleteTimeoutRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const timeoutUpdateCheckbox = useRef(null);

  const requestUpdateItem = useCallback(
    async (currentlyChecked = null) => {
      setRequestStatus("loading");

      const data = {
        id: task.id,
        content: draft.trim(),
        listId: task.listId,
        done: currentlyChecked ?? task.done,
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
    },
    [fetchWithAuth, draft, task],
  );

  const requestDeleteItem = useCallback(async () => {
    setRequestStatus("loading");

    try {
      const response = await fetchWithAuth(`http://localhost:8080/task/delete/${currentTask.id}`, {
        method: "DELETE",
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      }

      // If still on the same screen update the data
      if (mountedRef.current) {
        onDelete(currentTask);
      }
    } catch (e) {
      // If still on the same screen show error on screen
      console.error(e);
      if (mountedRef.current) setRequestStatus("error");
    }
  }, [fetchWithAuth]);

  function handleToggleTaskChecked(e) {
    clearTimeout(timeoutUpdateCheckbox.current);

    const currentlyChecked = e.target.checked;
    setChecked(currentlyChecked);

    timeoutUpdateCheckbox.current = setTimeout(() => {
      // If the status is the same as before don't do fetch
      if (task.done == currentlyChecked) return;

      // Update current task
      setTask((prevTask) => {
        return {
          ...prevTask,
          done: currentlyChecked,
        };
      });

      // Update on backend
      requestUpdateItem(currentlyChecked);
    }, 200);
  }

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

  function handleDeleteButton() {
    setCanDelete(false);

    // If already confirmed
    if (confirmDelete && canDelete) {
      requestDeleteItem();
    } else if (!confirmDelete) {
      // Not yet confirmed
      setConfirmDelete(true);

      // Wait a bit so its confirmed to delete
      confirmDeleteTimeoutRef.current = setTimeout(() => {
        setCanDelete(true);

        // After 2seconds of not clickig go back
        deleteTimeoutRef.current = setTimeout(() => {
          setConfirmDelete(false);
          setCanDelete(false);
        }, 2800);
      }, 200);
    }
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
      clearTimeout(confirmDeleteTimeoutRef.current);
      clearTimeout(deleteTimeoutRef.current);
      clearTimeout(timeoutUpdateCheckbox.current);
    };
  }, []);

  return (
    <div className={styles.items} htmlFor={task.id} data-error={requestStatus == "error"}>
      <label className={styles.content}>
        <input type="checkbox" id={task.id} checked={checked} onChange={handleToggleTaskChecked} />

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

        <button
          type="button"
          className={`square destructive ${confirmDelete ? styles.confirm_delete : ""}`}
          onClick={handleDeleteButton}
          title="Click to Delete, then click again to confirm the deletion (waiting 3 seconds it will reset to the start)"
        >
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
