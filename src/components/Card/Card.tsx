import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dashed' | 'filled';
}

function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Card;
