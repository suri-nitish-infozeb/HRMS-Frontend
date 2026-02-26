import { useRef } from "react";
import type { Message } from "./types";
import DynamicRenderer from "./DynamicRenderer";
import styles from "./ChatBubble.module.css";

import { downloadNodeAsPDF } from "./utils/exportPdf";
import { downloadNodeAsPNG } from "./utils/exportPng";
import { downloadTableAsXLSX, downloadTableAsCSV } from "./utils/exportExcel";

interface Props {
  message: Message;
}

const WIDE_TYPES = new Set(["table", "chart", "grid", "multi"]);

function formatTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function safeTitleToBaseName(title?: string) {
  const base = (title || "insight").slice(0, 60);
  return base.replace(/[^a-z0-9-_ ]/gi, "").trim().replace(/\s+/g, "_");
}

function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";
  const isWide = WIDE_TYPES.has(message.type);

  const contentRef = useRef<HTMLDivElement>(null);

  const canExport = !isUser && !!(message as any).export;
  const preferred = canExport ? (message as any).export.preferred : null;

  const handleDownload = async () => {
    console.log("✅ Download clicked", message.type, (message as any).export);
    if (!canExport) return;

    const baseName =
      message.type === "text"
        ? "response"
        : safeTitleToBaseName((message as any).title);

    // ✅ If AI suggests Excel/CSV AND message is table -> export real data
    if (preferred === "xlsx" && message.type === "table") {
      return downloadTableAsXLSX(message as any, `${baseName}.xlsx`);
    }

    if (preferred === "csv" && message.type === "table") {
      return downloadTableAsCSV(message as any, `${baseName}.csv`);
    }
    if (preferred === "png") {
      if (!contentRef.current) return;
      return downloadNodeAsPNG(contentRef.current, `${baseName}.png`);
    }
    // ✅ fallback/default -> PDF of rendered node (works for chart/grid/text/multi)
    if (!contentRef.current) return;
    return downloadNodeAsPDF(contentRef.current, `${baseName}.pdf`);
  };

  return (
    <div className={`${styles.row} ${isUser ? styles.rowUser : styles.rowAI}`}>
      {!isUser && <div className={styles.avatar}>AI</div>}

      <div
        className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAI} ${isWide ? styles.bubbleWide : ""
          }`}
      >
        {/* ✅ ONE download button */}
        {canExport && preferred && (
          <button className={styles.downloadBtn} onClick={handleDownload}>
            Download {String(preferred).toUpperCase()}
          </button>
        )}

        {/* capture area for PDF */}
        <div ref={contentRef} className={styles.captureArea}>
          <DynamicRenderer message={message} />
        </div>

        {message.timestamp && (
          <span className={`${styles.time} ${isUser ? styles.timeUser : styles.timeAI}`}>
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;