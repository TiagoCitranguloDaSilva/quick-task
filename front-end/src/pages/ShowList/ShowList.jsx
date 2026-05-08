import { useParams } from "react-router";
import styles from "./ShowList.module.css";
import useApi from "../../hooks/useApi";
import { useCallback, useEffect, useRef, useState } from "react";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import Error from "./partials/Error/Error";
import Loading from "./partials/Loading/Loading";

export default function ShowList() {
  const { id } = useParams();
  const parsed = Number(id);

  const { fetchWithAuth } = useApi();
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const startedRef = useRef(false);

  const fetchList = useCallback(
    async (signal) => {
      setData(null);
      setHasError(false);

      try {
        const response = await fetchWithAuth(`http://localhost:8080/list/${id}`, {
          signal: signal,
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API error ${response.status}: ${text}`);
        }

        // Get data as JSON
        const json = await response.json();

        // If still on the same screen update the data
        if (mountedRef.current) setData(json);
      } catch (e) {
        // If still on the same screen show error on screen
        console.error(e);
        if (mountedRef.current) setHasError(true);
      }
    },
    [fetchWithAuth, id],
  );

  useEffect(() => {
    mountedRef.current = true;

    const controller = new AbortController();

    // Fetch only on the first mount
    if (!startedRef.current) {
      fetchList(controller.signal);
      startedRef.current = true;
    }

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [fetchList]);

  // No id, OR, is a text, OR, Is not whole number, OR number is 0 or negative
  if (!id || Number.isNaN(parsed) || !Number.isInteger(parsed) || parsed < 1) {
    return (
      <NotFoundPage
        info={{ title: "List not found", description: "The list was deleted or doesn't exist" }}
      />
    );
  }

  // If got any errors go to error page
  if (hasError) return <Error fetchList={fetchList} />;

  // While loading lists show something on screen for feedback
  if (!data) return <Loading />;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      {data.tasks?.map((task) => (
        <span className={styles.list_item} key={task.id}>
          <input type="checkbox" />
          <span>{task.content}</span>
        </span>
      ))}
    </div>
  );
}
