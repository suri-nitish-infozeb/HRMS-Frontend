import styles from './QuickStats.module.css';

export interface QuickStatItem {
  label?: string;
  value: number;
  max?: number;
}

interface QuickStatsProps {
  title?: string;
  items: QuickStatItem[];
}

function QuickStats({ title = 'Quick Stats', items }: QuickStatsProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.bars}>
        {items.map((item, i) => {
          const pct = item.max && item.max > 0 ? Math.min(100, (item.value / item.max) * 100) : item.value;
          return (
            <div key={i} className={styles.barWrap}>
              <div className={styles.barBg}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuickStats;
