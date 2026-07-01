import { useState } from "react";
import styles from "./DeleteList.module.css";
import { Trash2, TriangleAlert, X } from "lucide-react";

export default function DeleteList({ ref, updateLists, currentListEditing }) {
  const [requestStatus, setRequestStatus] = useState("idle");

  function close() {
    ref.current?.close();
  }

  function handleSubmitButton() {
    console.log(currentListEditing.title);
    //
    setRequestStatus("error");
  }

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

            <button className="submit_button destructive" onClick={handleSubmitButton}>
              <Trash2 />
              Delete
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
