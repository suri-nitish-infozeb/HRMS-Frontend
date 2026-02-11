import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import Sidebar from '../Sidebar';
import Header from '../Header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

function ContentFadeIn({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={visible ? styles.contentVisible : styles.contentEnter}>
      {children}
    </div>
  );
}

function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main
          className={`${styles.content} ${location.pathname === ROUTES.HOME_STATIC ? styles.contentStatic : ''}`}
        >
          <ContentFadeIn key={location.pathname}>{children}</ContentFadeIn>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
