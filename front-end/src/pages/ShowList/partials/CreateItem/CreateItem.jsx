import { Plus, LoaderCircle, CircleX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CreateItem.module.css";
import useApi from "../../../../hooks/useApi";

export default function CreateItem({ listId, onAdd }) {
  const { fetchWithAuth } = useApi();

  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");
  const mountedRef = useRef(true);

  const inputRef = useRef(null);

  const [content, setContent] = useState("");

  const requestCreateItem = useCallback(async (value) => {
    setRequestStatus("loading");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetchWithAuth("http://localhost:8080/task/create", {
        method: "POST",
        body: JSON.stringify({
          content: value,
          listId: listId,
          done: false,
        }),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        setRequestStatus("error");
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      }

      // With success on creating
      setRequestStatus("success");

      // Update lists on home
      onAdd();
      setContent("");
    } catch (e) {
      // If still on the same screen show error on screen
      console.error(e);
      setRequestStatus("error");
    }
  });

  function handleSubmit(e) {
    e.preventDefault();

    // If already trying to add do nothing
    if (requestStatus == "loading") return;

    const value = content.trim();

    // If empty return here
    if (value == "") return;

    requestCreateItem(value);
  }

  function handleInput(e) {
    setContent(e.target.value);
  }

  useEffect(() => {
    if (content != "") return;

    inputRef.current.focus();
  }, [content]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // On unmount cancel fetch
      controllerRef.current.abort();
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.add_div} data-error={requestStatus == "error"}>
      <input
        type="text"
        ref={inputRef}
        className={styles.add_input}
        onChange={handleInput}
        value={content}
      />

      <button className="square">
        {requestStatus == "loading" ? <LoaderCircle className={styles.loading} /> : <Plus />}
      </button>

      {requestStatus == "error" ? (
        <p className={`error ${styles.error}`}>
          An error ocurred
          <CircleX className={styles.error_svg} />
        </p>
      ) : null}
    </form>
  );
}
