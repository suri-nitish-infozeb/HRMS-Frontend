import type { TableMessage } from "../types";
import styles from "./TableRenderer.module.css";

interface Props {
  message: TableMessage;
}

function isUrl(value: string): boolean {
  return typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"));
}

function getLinkLabel(url: string): string {
  if (url.includes("sharepoint.com")) return "📊 Open in Excel";
  if (url.includes("/careers/")) return "🔗 Career Page";
  return "🔗 Open Link";
}

function CellContent({ value }: { value: string | number }) {
  const str = String(value);
  if (!str || str === "None" || str === "") return <span className={styles.empty}>—</span>;
  if (isUrl(str)) {
    return (
      <a href={str} target="_blank" rel="noreferrer" className={styles.linkBtn}>
        {getLinkLabel(str)}
      </a>
    );
  }
  return <>{str}</>;
}

function TableRenderer({ message }: Props) {
  return (
    <div className={styles.wrapper}>
      {message.title && <p className={styles.title}>{message.title}</p>}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {message.columns.map((col) => (
                <th key={col} className={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {message.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                {message.columns.map((col) => (
                  <td key={col} className={styles.td}>
                    <CellContent value={row[col] ?? ""} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.rowCount}>{message.rows.length} records</p>
    </div>
  );
}

export default TableRenderer;