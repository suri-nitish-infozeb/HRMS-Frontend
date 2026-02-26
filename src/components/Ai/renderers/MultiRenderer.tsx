import DynamicRenderer from "../DynamicRenderer";
import type { Message, MultiMessage } from "../types";
import styles from "./MultiRenderer.module.css";

export default function MultiRenderer({ message }: { message: MultiMessage }) {
  return (
    <div className={styles.wrapper}>
      {message.title && <div className={styles.title}>{message.title}</div>}

      <div className={styles.blocks}>
        {message.blocks?.map((block: Message, idx: number) => (
          <div key={block.id ?? `block-${idx}`} className={styles.block}>
            <DynamicRenderer message={block} />
          </div>
        ))}
      </div>
    </div>
  );
}