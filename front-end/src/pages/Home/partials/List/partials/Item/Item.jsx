import useApi from "../../../../../../hooks/useApi";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Item({ className, inputId, task, setRequestStatus }) {
  const { fetchWithAuth } = useApi();

  const mountedRef = useRef(true);
  const controllerRef = useRef(new AbortController());

  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(task.done);

  const timeoutUpdateCheckbox = useRef(null);

  const requestUpdateItem = useCallback(
    async (currentlyChecked = null) => {
      const data = {
        id: task.id,
        content: task.content,
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
          setError(false);
        }
      } catch (e) {
        // If still on the same screen show error on screen
        console.error(e);
        if (mountedRef.current) {
          setRequestStatus("error");
          setError(true);
        }
      }
    },
    [fetchWithAuth, task],
  );

  function handleToggleTaskChecked(e) {
    clearTimeout(timeoutUpdateCheckbox.current);

    const currentlyChecked = e.target.checked;
    setChecked(currentlyChecked);

    timeoutUpdateCheckbox.current = setTimeout(() => {
      // If the status is the same as before don't do fetch
      if (task.done == currentlyChecked) return;

      // Update on backend
      requestUpdateItem(currentlyChecked);
    }, 200);
  }

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // On unmount cancel fetch
      controllerRef.current.abort();
      clearTimeout(timeoutUpdateCheckbox.current);
    };
  }, []);

  return (
    <div className={className} data-error={error}>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={handleToggleTaskChecked}
        onClick={(e) => e.stopPropagation()}
      />

      <p>{task.content}</p>
    </div>
  );
}
