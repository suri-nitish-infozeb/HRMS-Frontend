import styles from './Placeholder.module.css';

interface PlaceholderProps {
  title: string;
  description?: string;
}

function Placeholder({ title, description = 'This section is under construction.' }: PlaceholderProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.desc}>{description}</p>
    </div>
  );
}

export default Placeholder;
