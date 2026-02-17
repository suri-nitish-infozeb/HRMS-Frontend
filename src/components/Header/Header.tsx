import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Bell, Sparkles, LayoutGrid } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setMode } from '../../store/slices/appSlice';
import { ROUTES } from '../../constants';
import type { AppMode } from '../../types';
import styles from './Header.module.css';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const mode = useAppSelector((state) => state.app.mode);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeSelect = (newMode: AppMode) => {
    dispatch(setMode(newMode));
    setDropdownOpen(false);
    if (newMode === 'ai') navigate(ROUTES.HOME_AI);
    else navigate(ROUTES.HOME_STATIC);
  };

  const modeLabel = mode === 'ai' ? 'AI Mode' : 'Static Mode';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.modeDropdown} ref={dropdownRef}>
          <button
            type="button"
            className={styles.modeTrigger}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span>{modeLabel}</span>
            <ChevronDown size={18} strokeWidth={2} className={styles.chevron} />
          </button>
          {dropdownOpen && (
            <ul className={styles.dropdownMenu} role="listbox">
              <li>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => handleModeSelect('ai')}
                >
                  <Sparkles size={18} strokeWidth={1.8} />
                  <span>AI Mode</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => handleModeSelect('static')}
                >
                  <LayoutGrid size={18} strokeWidth={1.8} />
                  <span>Static Mode</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <Bell size={22} strokeWidth={1.8} />
          <span className={styles.notificationDot} aria-hidden />
        </button>
        <div className={styles.divider} />
        <div className={styles.userInfo}>
          <div className={styles.userText}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
          <div className={styles.avatar}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              <span>{user.name.slice(0, 1)}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
