import styles from "./Error.module.css";

export default function Error({ fetchLists }) {
  function tryFetchLists() {
    fetchLists();
  }

  return (
    <div className={styles.error}>
      <p>Sorry an error occured</p>
      <button
        onClick={() => {
          tryFetchLists();
        }}
      >
        Try again
      </button>
    </div>
  );
}
