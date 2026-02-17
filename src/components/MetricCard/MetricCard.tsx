import type { ReactNode } from 'react';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  title: string;
  icon: ReactNode;
  value: string;
  change?: { text: string; positive: boolean };
  detail?: string;
}

function MetricCard({ title, icon, value, change, detail }: MetricCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.iconWrap}>{icon}</div>
      </div>
      <p className={styles.value}>{value}</p>
      {change && (
        <p className={styles.change} data-positive={change.positive}>
          {change.positive ? '↑' : '↓'} {change.text}
        </p>
      )}
      {detail && !change && <p className={styles.detail}>{detail}</p>}
    </div>
  );
}

export default MetricCard;
