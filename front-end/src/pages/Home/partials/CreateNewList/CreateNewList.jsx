import { useCallback, useRef, useState } from "react";
import ListForm from "../../../../components/ListForm/ListForm";
import useApi from "../../../../hooks/useApi";

export default function CreateNewList({ ref, updateLists }) {
  const { fetchWithAuth } = useApi();

  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");

  const requestCreateList = useCallback(async (data) => {
    setRequestStatus("idle");
    try {
      const response = await fetchWithAuth("/list/create", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
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
      submitType="create"
    />
  );
}
