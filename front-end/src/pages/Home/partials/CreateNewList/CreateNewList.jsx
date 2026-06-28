import { Asterisk, ClipboardPlus, Plus, X } from "lucide-react";
import styles from "./CreateNewList.module.css";
import { useEffect, useState } from "react";

export default function CreateNewList({ ref }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [errors, setErros] = useState({ title: false, description: false });

  function close() {
    ref.current?.close();
  }

  function createNewList() {
    const values = {
      title: form.title.trim(),
      description: form.description.trim(),
    };
    let errorValues = {
      title: false,
      description: false,
    };

    if (values.title == "") {
      errorValues.title = true;
    }

    if (values.description == "") {
      errorValues.description = true;
    }

    setErros(errorValues);

    // If has any validation errors stop here
    if (errorValues.title || errorValues.description) {
      return;
    }

    console.log("Good");
    // ref.current?.close();
  }

  return (
    <dialog className={styles.dialog} ref={ref}>
      <div className={styles.dialog_container}>
        <button className={`square ${styles.close_button}`} title="Close" onClick={close}>
          <X />
        </button>

        <div className={styles.dialog_contents}>
          <div className={styles.dialog_group}>
            <label htmlFor="title">
              Title
              <Asterisk size={16} />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={(e) => {
                setForm((prevForm) => ({ ...prevForm, title: e.target.value }));
              }}
              data-invalid={errors.title}
            />
            {errors.title ? <p className="validation_error">Title is required</p> : null}
          </div>

          <div className={styles.dialog_group}>
            <label htmlFor="description">
              Description
              <Asterisk size={16} />
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              onChange={(e) => {
                setForm((prevForm) => ({ ...prevForm, description: e.target.value }));
              }}
              value={form.description}
              data-invalid={errors.description}
            ></textarea>
            {errors.description ? (
              <p className="validation_error">Description is required</p>
            ) : null}
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
