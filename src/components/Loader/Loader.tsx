import styles from './Loader.module.css';

interface LoaderProps {
  message?: string;
}

function Loader({ message = "Loading chart..." }: LoaderProps) {
  return (
    <div className={styles.wrap} aria-label="Loading">
      <div className={styles.spinner} />

      <p className={styles.text}>{message}</p>
    </div>
  );
}

export default Loader;