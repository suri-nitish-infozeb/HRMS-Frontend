import type { JobDescriptionRow } from '../../services/api';
import styles from './JobDescriptionsTable.module.css';

interface JobDescriptionsTableProps {
  data: JobDescriptionRow[];
}

const DEFAULT_COLUMNS = ['title', 'department', 'description'];

function getColumns(rows: JobDescriptionRow[]): string[] {
  if (rows.length === 0) return DEFAULT_COLUMNS;
  const keys = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((k) => keys.add(k)));
  const preferred = ['id', 'title', 'department', 'description', 'location', 'type'];
  const ordered = preferred.filter((k) => keys.has(k));
  const rest = [...keys].filter((k) => !preferred.includes(k)).sort();
  return [...ordered, ...rest];
}

function cellValue(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function JobDescriptionsTable({ data }: JobDescriptionsTableProps) {
  const columns = getColumns(data);

  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Job Descriptions</h3>
        <p className={styles.empty}>No job descriptions found.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Job Descriptions</h3>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((key) => (
                <th key={key} className={styles.th}>
                  {key.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={(row.id ?? i) as string} className={styles.tr}>
                {columns.map((key) => (
                  <td key={key} className={styles.td}>
                    {cellValue(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobDescriptionsTable;
