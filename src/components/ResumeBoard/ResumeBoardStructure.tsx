import { useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from './ResumeBoardStructure.module.css';

const EDGE_THRESHOLD = 80;
const SCROLL_AMOUNT = 14;

interface ResumeBoardStructureProps {
  title: string;
  filterSlot: ReactNode;
  columnSlot: ReactNode;
  footerSlot: ReactNode;
}

function ResumeBoardStructure({ title, filterSlot, columnSlot, footerSlot }: ResumeBoardStructureProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const handleBoardDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX;
    if (x < rect.left + EDGE_THRESHOLD) {
      el.scrollLeft -= SCROLL_AMOUNT;
    } else if (x > rect.right - EDGE_THRESHOLD) {
      el.scrollLeft += SCROLL_AMOUNT;
    }
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.filters}>{filterSlot}</div>
      </header>
      <div
        ref={boardRef}
        className={styles.board}
        onDragOver={handleBoardDragOver}
      >
        {columnSlot}
      </div>
      <footer className={styles.footer}>{footerSlot}</footer>
    </div>
  );
}

export default ResumeBoardStructure;
