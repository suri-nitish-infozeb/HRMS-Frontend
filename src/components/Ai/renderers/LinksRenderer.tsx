import type { LinksMessage } from "../types";
import styles from "./LinksRenderer.module.css";

interface Props {
  message: LinksMessage;
}

function LinksRenderer({ message }: Props) {
  return (
    <div className={styles.wrapper}>
      {message.title && <p className={styles.title}>{message.title}</p>}
      <div className={styles.list}>
        {message.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
          >
            <div className={styles.cardLeft}>
              {link.icon && <span className={styles.icon}>{link.icon}</span>}
              <div>
                <span className={styles.label}>{link.label}</span>
                {link.description && (
                  <span className={styles.description}>{link.description}</span>
                )}
              </div>
            </div>
            <span className={styles.arrow}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default LinksRenderer;