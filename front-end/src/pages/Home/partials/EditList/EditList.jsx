import { useCallback, useRef, useState } from "react";
import useApi from "../../../../hooks/useApi";
import ListForm from "../../../../components/ListForm/ListForm";

export default function EditList({ ref, updateLists, currentListEditing }) {
  const { fetchWithAuth } = useApi();

  const controllerRef = useRef(new AbortController());
  const [requestStatus, setRequestStatus] = useState("idle");

  const requestEditList = useCallback(async (data) => {
    setRequestStatus("idle");

    const titleChanged = data.title != currentListEditing.title;
    const descriptionChanged = data.description != currentListEditing.description;

    // No changes were made
    if (!titleChanged && !descriptionChanged) {
      // Close dialog
      ref.current?.close();
      return;
    }

    try {
      const response = await fetchWithAuth("http://localhost:8080/list/edit", {
        method: "PUT",
        body: JSON.stringify({
          id: currentListEditing.id,
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

  return (
    <ListForm
      ref={ref}
      onSubmit={requestEditList}
      controllerRef={controllerRef}
      requestStatus={requestStatus}
      setRequestStatus={setRequestStatus}
      data={currentListEditing}
      submitType="edit"
    />
  );
}
