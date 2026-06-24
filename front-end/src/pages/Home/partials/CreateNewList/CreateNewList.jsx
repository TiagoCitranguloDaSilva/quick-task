import { ClipboardPlus, Plus, X } from "lucide-react";
import styles from "./CreateNewList.module.css";

export default function CreateNewList({ ref }) {
  function close() {
    ref.current?.close();
  }

  function createNewList() {
    ref.current?.close();
  }

  return (
    <dialog className={styles.dialog} ref={ref}>
      <div className={styles.dialog_container}>
        <button className={`square ${styles.close_button}`} title="Close" onClick={close}>
          <X />
        </button>

        <div className={styles.dialog_contents}>
          <div className={styles.dialog_group}>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>

          <div className={styles.dialog_group}>
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" rows="3"></textarea>
          </div>

          <div className={styles.action_buttons}>
            <button className={styles.cancel_button} onClick={close}>
              <X />
              Cancel
            </button>

            <button className={styles.create_button} onClick={createNewList}>
              <ClipboardPlus />
              Create
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
