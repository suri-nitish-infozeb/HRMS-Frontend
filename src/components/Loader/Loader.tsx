import styles from './Loader.module.css';

function Loader() {
  return (
    <div className={styles.wrap} aria-label="Loading">
      <div className={styles.spinner} />
      <p className={styles.text}>Loading chart...</p>
    </div>
  );
}

export default Loader;
