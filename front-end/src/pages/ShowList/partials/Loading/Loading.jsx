import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={`${styles.loading} breakout`} key="loading_lists">
      <p>Loding list</p>
    </div>
  );
}
