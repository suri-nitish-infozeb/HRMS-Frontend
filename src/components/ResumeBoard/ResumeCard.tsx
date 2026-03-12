import styles from './ResumeCard.module.css';

export interface ResumeCardItem {
  id: string;
  candidateName: string;
  initials: string;
  affiliation: string;
  date: string;
  columnId: string;
  actions: string[];
}

const ACTION_LABELS: Record<string, string> = {
  view: 'View',
  download: 'Download',
  send_email: 'Send Email',
  send_offer: 'Send Offer',
};

interface ResumeCardProps {
  item: ResumeCardItem;
  dragDataKey?: string;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onSendEmail?: (id: string) => void;
  onSendOffer?: (id: string) => void;
}

function ResumeCard({ item, dragDataKey, onView, onDownload, onSendEmail, onSendOffer }: ResumeCardProps) {
  const handleAction = (action: string) => {
    const handlers: Record<string, (() => void) | undefined> = {
      view: () => onView?.(item.id),
      download: () => onDownload?.(item.id),
      send_email: () => onSendEmail?.(item.id),
      send_offer: () => onSendOffer?.(item.id),
    };
    handlers[action]?.();
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (dragDataKey) {
      e.dataTransfer.setData(dragDataKey, item.id);
      e.dataTransfer.effectAllowed = 'move';
    }
    e.currentTarget.classList.add(styles.dragging);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove(styles.dragging);
  };

  return (
    <div
      className={styles.card}
      draggable={!!dragDataKey}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.avatar}>{item.initials}</div>
      <div className={styles.content}>
        <span className={styles.name}>{item.candidateName}</span>
        <span className={styles.meta}>{item.affiliation} • {item.date}</span>
      </div>
      <div className={styles.actions}>
        {item.actions.map((action) => (
          <button
            key={action}
            type="button"
            className={styles.actionBtn}
            onClick={() => handleAction(action)}
          >
            {ACTION_LABELS[action] ?? action}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ResumeCard;
