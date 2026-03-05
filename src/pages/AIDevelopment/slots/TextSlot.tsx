import styles from "./TextSlot.module.css";
import type { TextBlock } from "../types";

type Props = {
  block: TextBlock;
};

export default function TextSlot({ block }: Props) {
  return (
    <div className={styles.surface}>
      <div className={styles.body}>{block.content}</div>
    </div>
  );
}