import { Plus } from "lucide-react";
import styles from "./AddButton.module.css";

export default function AddButton({ createNewList, noList = false }) {
  return (
    <button className={`${styles.button}`} data-nolist={noList} onClick={createNewList}>
      <Plus size={24} />
      <span className={styles.button_phrase}>Create a new list</span>
    </button>
  );
}
