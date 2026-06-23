import AddButton from "../AddButton/AddButton";
import styles from "./NoListFound.module.css";

export default function NoListFound({ createNewList }) {
  return (
    <div className={styles.main}>
      <img src="/assets/images/NoList.svg" alt="" />

      <p className={styles.noListFound}>
        <strong className={styles.noneFound}>You don't have any lists.</strong>
        <span>Create a list and start organizing.</span>
      </p>

      <AddButton noList={true} createNewList={createNewList} />
    </div>
  );
}
