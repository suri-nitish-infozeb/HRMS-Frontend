import type { ReactNode } from 'react';
import styles from './QuickActions.module.css';

export interface QuickActionItem {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}

interface QuickActionsProps {
  title?: string;
  actions: QuickActionItem[];
}

function QuickActions({ title = 'Quick Actions', actions }: QuickActionsProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.cards}>
        {actions.map((action, i) => (
          <article key={i} className={styles.card}>
            <div className={styles.iconWrap}>{action.icon}</div>
            <h3 className={styles.cardTitle}>{action.title}</h3>
            <p className={styles.cardDesc}>{action.description}</p>
            <button
              type="button"
              className={styles.actionLink}
              onClick={action.onAction}
            >
              {action.actionLabel}
              <span className={styles.arrow}>→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
