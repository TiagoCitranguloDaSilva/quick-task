import { useCallback, useRef, useState } from "react";
import useApi from "../../../../hooks/useApi";
import ListForm from "../../../../components/ListForm/ListForm";

export default function CreateNewList({ ref, updateLists }) {
  const { fetchWithAuth } = useApi();

  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");

  const requestCreateList = useCallback(async (data) => {
    setRequestStatus("idle");
    try {
      const response = await fetchWithAuth("http://localhost:8080/list/create", {
        method: "POST",
        body: JSON.stringify({
          title: data.title.trim(),
          description: data.description.trim(),
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

  return (
    <ListForm
      ref={ref}
      onSubmit={requestCreateList}
      controllerRef={controllerRef}
      requestStatus={requestStatus}
      setRequestStatus={setRequestStatus}
    />
  );
}
