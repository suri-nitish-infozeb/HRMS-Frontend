import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ReplitBadge.module.css';

function ReplitBadge() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={styles.badge}>
      <span className={styles.text}>Made with Replit</span>
      <button
        type="button"
        className={styles.close}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export default ReplitBadge;
