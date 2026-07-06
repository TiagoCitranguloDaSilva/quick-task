import { Asterisk, ClipboardPlus, Plus, Save, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useApi from "../../hooks/useApi";
import ErrorMessage from "../ErrorMessage";

export default function ListForm({
  ref,
  onSubmit,
  controllerRef,
  requestStatus,
  setRequestStatus,
  data,
  submitType,
}) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState({
    title: { invalid: false, message: null },
    description: { invalid: false, message: null },
  });

  function validateInput(key, named, optionsPassed = {}) {
    const options = {
      nullable: optionsPassed.nullable ?? false,
    };
    let selected = form[key];
    let invalid = true;
    let message = null;

    if (selected == null) return;

    let value = selected.trim();

    // If can't be nullable and is null give an error
    if (value.length == 0 && !options.nullable) {
      message = `${named} required`;
    } else if (value.length > 255) {
      message = `${named} must not exceed 255 characters`;
    } else {
      invalid = false;
    }

    setError((prevError) => ({ ...prevError, [key]: { invalid: invalid, message: message } }));
    return invalid;
  }

  const mountedRef = useRef(true);

  function close() {
    ref.current?.close();
  }

  function handleSubmitButton() {
    setRequestStatus("idle");

    setError({
      title: { invalid: false, message: null },
      description: { invalid: false, message: null },
    });

    const invalid = {
      title: validateInput("title", "Title"),
      description: validateInput("description", "Description", { nullable: true }),
    };

    // If has any validation errors stop here
    if (invalid.title || invalid.description) {
      return;
    }

    onSubmit({ title: form.title.trim(), description: form.description.trim() });
  }

  useEffect(() => {
    setForm({
      title: data?.title ?? "",
      description: data?.description ?? "",
    });
  }, [data]);

  useEffect(() => {
    if (requestStatus != "success") return;
    // Only run when sucess, top clear fields

    // Clear out fields
    setForm({ title: "", description: "" });
  }, [requestStatus]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // On unmount cancel fetch
      controllerRef.current.abort();
    };
  }, []);

  return (
    <dialog className="dialog" ref={ref}>
      <div className="dialog_container">
        <button className="square close_button" title="Close" onClick={close}>
          <X />
        </button>

        <div className="dialog_contents">
          <div className="dialog_group">
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
              data-invalid={error.title}
            />

            <ErrorMessage error={error.title} message={error.title.message} />
          </div>

          <div className="dialog_group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows="3"
              onChange={(e) => {
                setForm((prevForm) => ({ ...prevForm, description: e.target.value }));
              }}
              value={form.description}
              data-invalid={error.description}
            ></textarea>

            <ErrorMessage error={error.description} message={error.description.message} />
          </div>

          {requestStatus == "error" ? <p className="validation_error">Server error</p> : null}

          <div className="action_buttons">
            <button className="cancel_button" onClick={close}>
              <X />
              Cancel
            </button>

            <button className="submit_button" onClick={handleSubmitButton}>
              {submitType == "create" ? (
                <>
                  <ClipboardPlus />
                  Create
                </>
              ) : (
                <>
                  <Save />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
