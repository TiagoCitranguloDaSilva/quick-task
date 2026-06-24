import { Plus } from "lucide-react";
import styles from "./AddButton.module.css";

export default function AddButton({ openCreateNewList, noList = false }) {
  return (
    <button className={`${styles.button}`} data-nolist={noList} onClick={openCreateNewList}>
      <Plus size={24} />
      <span className={styles.button_phrase}>Create a new list</span>
    </button>
  );
}
