import styles from "./NotFoundPage.module.css";

export default function NotFoundPage({ info }) {
  return (
    <div className={styles.error}>
      <h1>404</h1>
      {info ? (
        <>
          <p className={styles.error_title}>{info.title}</p>
          {info.description ? <p className={styles.error_description}>{info.description}</p> : ""}
        </>
      ) : (
        <>
          <p className={styles.error_title}>Oops!</p>
          <p className={styles.error_description}>The page you're looking for does not exist.</p>
        </>
      )}
    </div>
  );
}
