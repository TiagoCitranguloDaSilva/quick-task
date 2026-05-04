import { useCallback, useEffect, useRef, useState } from "react";
import useApi from "../../hooks/useApi";
import Error from "./partials/Error/Error";
import List from "./partials/List/List";
import styles from "./Home.module.css";
import Loading from "./partials/Loading/Loading";

export default function Home() {
  const { fetchWithAuth } = useApi();
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const startedRef = useRef(false);

  const fetchLists = useCallback(
    async (signal) => {
      setData(null);
      setHasError(false);

      try {
        const response = await fetchWithAuth("http://localhost:8080/list", { signal: signal });
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
    [fetchWithAuth],
  );

  useEffect(() => {
    mountedRef.current = true;

    const controller = new AbortController();

    // Fetch only on the first mount
    if (!startedRef.current) {
      fetchLists(controller.signal);
      startedRef.current = true;
    }

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [fetchLists]);

  // If got any errors go to error page
  if (hasError) return <Error fetchLists={fetchLists} />;

  // While loading lists show something on screen for feedback
  if (!data) return <Loading />;

  return (
    <div className={`${styles.home} breakout`} key="loaded_lists">
      {data.map((list) => (
        <List list={list} />
      ))}
    </div>
  );
}
