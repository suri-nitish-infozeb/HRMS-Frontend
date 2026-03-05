import styles from './PendingApprovals.module.css';

export interface ApprovalItem {
  id: string;
  name: string;
  requestType: string;
  status: 'urgent' | 'pending' | 'new';
}

const DEFAULT_ITEMS: ApprovalItem[] = [
  { id: '1', name: 'Sarah Connor', requestType: 'Leave Request', status: 'urgent' },
  { id: '2', name: 'John Doe', requestType: 'Leave Request', status: 'pending' },
  { id: '3', name: 'Ellen Ripley', requestType: 'Promotion Request', status: 'new' },
];

function getInitial(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 1).toUpperCase();
}

interface PendingApprovalsProps {
  items?: ApprovalItem[];
  onViewAll?: () => void;
}

function PendingApprovals({ items = DEFAULT_ITEMS, onViewAll }: PendingApprovalsProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Pending Approvals</h3>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.avatar}>{getInitial(item.name)}</div>
            <div className={styles.content}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.requestType}>{item.requestType}</span>
            </div>
            <span className={`${styles.tag} ${styles[`tag_${item.status}`]}`}>
              {item.status === 'urgent' ? 'Urgent' : item.status === 'pending' ? 'Pending' : 'New'}
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.button} onClick={onViewAll}>
        View All Approvals
      </button>
    </div>
  );
}

export default PendingApprovals;
