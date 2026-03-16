import type { FileMessage } from "../types";
import styles from "./FileRenderer.module.css";

interface Props {
  message: FileMessage;
}

const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  xlsx: "📊",
  csv: "📋",
  docx: "📝",
  zip: "🗜️",
  png: "🖼️",
  jpg: "🖼️",
};

function FileRenderer({ message }: Props) {
  const ext = message.fileName.split(".").pop()?.toLowerCase() ?? "";
  const icon = FILE_ICONS[ext] ?? "📁";

  return (
    <a href={message.fileUrl} download className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <div className={styles.info}>
        <span className={styles.name}>{message.fileName}</span>
        <span className={styles.meta}>
          {message.fileType ?? ext.toUpperCase()}
          {message.fileSize ? ` • ${message.fileSize}` : ""}
        </span>
      </div>
      <span className={styles.downloadBtn}>⬇ Download</span>
    </a>
  );
}

export default FileRenderer;