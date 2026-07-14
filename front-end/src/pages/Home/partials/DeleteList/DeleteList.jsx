import { Trash2, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useApi from "../../../../hooks/useApi";
import styles from "./DeleteList.module.css";

export default function DeleteList({ ref, updateLists, currentListEditing }) {
  const { fetchWithAuth } = useApi();

  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");
  const mountedRef = useRef(true);

  function close() {
    ref.current?.close();
  }

  const requestEditList = useCallback(async (data) => {
    setRequestStatus("idle");

    try {
      const response = await fetchWithAuth(`/list/delete/${currentListEditing.id}`, {
        method: "DELETE",
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        setRequestStatus("error");
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      }

      // With success on editing
      setRequestStatus("success");

      // Close dialog
      ref.current?.close();

      // Update lists on home
      updateLists();
    } catch (e) {
      // If still on the same screen show error on screen
      console.error(e);
      setRequestStatus("error");
    }
  });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // On unmount cancel fetch
      controllerRef.current.abort();
    };
  }, []);

  return (
    <dialog className="dialog" ref={ref}>
      <div className="dialog_container">
        <button className="square close_button" title="Close" onClick={close}>
          <X />
        </button>

        <div className="dialog_contents">
          <p>Are you sure you want to delete "{currentListEditing?.title}"?</p>

          <p className={styles.warning}>
            <TriangleAlert /> <strong>This can't be undone</strong>
          </p>

          {requestStatus == "error" ? <p className="validation_error">Server error</p> : null}

          <div className="action_buttons">
            <button className="cancel_button" onClick={close}>
              <X />
              Cancel
            </button>

            <button className="submit_button destructive" onClick={requestEditList}>
              <Trash2 />
              Delete
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
