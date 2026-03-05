import styles from "./TableSlot.module.css";
import type { TableBlock } from "../types";

type Props = {
  block: TableBlock;
};

function isStatusColumn(colName: string): boolean {
  return colName.trim().toLowerCase() === "status";
}

export default function TableSlot({ block }: Props) {
  return (
    <div className={styles.surface}>
      <div className={styles.header}>
        <div className={styles.title}>{block.title ?? "Table"}</div>
        <div className={styles.meta}>{block.rows.length} records</div>
      </div>

      <div className={styles.body}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={`${block.id}-r-${i}`}>
                  {row.map((cell, j) => {
                    const col = block.columns[j] ?? "";
                    const cellKey = `${block.id}-r-${i}-c-${j}`;

                    return (
                      <td key={cellKey}>
                        {isStatusColumn(col) ? (
                          <span className={styles.badge}>{String(cell)}</span>
                        ) : (
                          String(cell)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}