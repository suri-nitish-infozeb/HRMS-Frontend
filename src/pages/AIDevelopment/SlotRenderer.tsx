import parse from "html-react-parser";
import DOMPurify from "dompurify";
import styles from "./SlotRenderer.module.css";
import type { UIResponse, UIHtmlBlock } from "./types";

type Props = { blocks: UIResponse };

function widthClass(md?: number, lg?: number): string {
  const mdVal = md ?? 12;
  const lgVal = lg ?? mdVal;

  const mdClass = mdVal === 6 ? styles.md6 : styles.md12;
  const lgClass = lgVal === 6 ? styles.lg6 : styles.lg12;

  return `${mdClass} ${lgClass}`;
}

function renderParsedHtml(html: string) {
  const safeHtml = DOMPurify.sanitize(html);
  return parse(safeHtml);
}

export default function SlotRenderer({ blocks }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {blocks.uiHtml.map((block) => (
          <div
            key={block.id}
            className={`${styles.col} ${widthClass(block.layout?.md, block.layout?.lg)}`}
          >
            {renderParsedHtml(renderSlotHtml(block))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSlotHtml(block: UIHtmlBlock): string {
  switch (block.slot) {
    case "chart":
    case "table":
    case "text":
    case "list":
      return block.html;
    default:
      return "";
  }
}