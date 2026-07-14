import { useCallback, useEffect, useRef, useState } from "react";
import useApi from "../../hooks/useApi";
import styles from "./Home.module.css";
import AddButton from "./partials/AddButton/AddButton";
import CreateNewList from "./partials/CreateNewList/CreateNewList";
import DeleteList from "./partials/DeleteList/DeleteList";
import EditList from "./partials/EditList/EditList";
import Error from "./partials/Error/Error";
import List from "./partials/List/List";
import Loading from "./partials/Loading/Loading";
import NoListFound from "./partials/NoListFound/NoListFound";

export default function Home() {
  const { fetchWithAuth } = useApi();
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const startedRef = useRef(false);
  const controllerRef = useRef(new AbortController());

  const createDialogRef = useRef(null);
  const editDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  const [currentListEditing, setCurrentListEditing] = useState(null);

  const fetchLists = useCallback(async () => {
    setData(null);
    setHasError(false);

    try {
      const response = await fetchWithAuth("/list/all", {
        signal: controllerRef.current.signal,
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
  }, [fetchWithAuth]);

  function openCreateNewList() {
    createDialogRef.current.showModal();
  }

  function openEditList(list) {
    setCurrentListEditing(list);
    editDialogRef.current.showModal();
  }

  function openDeleteList(list) {
    setCurrentListEditing(list);
    deleteDialogRef.current.showModal();
  }

  function updateLists() {
    fetchLists(controllerRef.current.signal);
  }

  useEffect(() => {
    mountedRef.current = true;

    // Fetch only on the first mount
    if (!startedRef.current) {
      fetchLists(controllerRef.current.signal);
      startedRef.current = true;
    }

    return () => {
      mountedRef.current = false;
      controllerRef.current.abort();
    };
  }, [fetchLists]);

  // If got any errors go to error page
  if (hasError) return <Error fetchLists={fetchLists} />;

  // While loading lists show something on screen for feedback
  if (!data) return <Loading />;

  // If has no list, show a no list found
  if (data.length == 0) {
    return (
      <>
        <NoListFound openCreateNewList={openCreateNewList} />
        <CreateNewList ref={createDialogRef} updateLists={updateLists} />
        <EditList
          ref={editDialogRef}
          updateLists={updateLists}
          currentListEditing={currentListEditing}
        />
        <DeleteList
          ref={deleteDialogRef}
          updateLists={updateLists}
          currentListEditing={currentListEditing}
        />
      </>
    );
  }

  return (
    <>
      <div className={`${styles.header} breakout`}>
        <p>Lists: {data.length}</p>

        <AddButton openCreateNewList={openCreateNewList} />
      </div>
      <div className={`${styles.home} breakout`}>
        {data.map((list) => (
          <List
            list={list}
            key={list.id}
            openEditList={openEditList}
            openDeleteList={openDeleteList}
          />
        ))}
      </div>

      <CreateNewList ref={createDialogRef} updateLists={updateLists} />
      <EditList
        ref={editDialogRef}
        updateLists={updateLists}
        currentListEditing={currentListEditing}
      />
      <DeleteList
        ref={deleteDialogRef}
        updateLists={updateLists}
        currentListEditing={currentListEditing}
      />
    </>
  );
}
