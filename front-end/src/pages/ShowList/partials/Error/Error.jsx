import styles from "./Error.module.css";

export default function Error({ fetchList }) {
  function tryFetchList() {
    fetchList();
  }

  return (
    <div className={styles.error}>
      <p>Sorry an error occured</p>
      <button
        onClick={() => {
          tryFetchList();
        }}
      >
        Try again
      </button>
    </div>
  );
}
