import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Bell, Sparkles, LayoutGrid, Sun, Moon, Settings } from 'lucide-react';
import { useAppSelector, useAppDispatch, useTheme } from '../../hooks';
import { setMode } from '../../store/slices/appSlice';
import { ROUTES } from '../../constants';
import type { AppMode } from '../../types';
import styles from './Header.module.css';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const mode = useAppSelector((state) => state.app.mode);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target) || userDropdownRef.current?.contains(target)) return;
      setDropdownOpen(false);
      setUserDropdownOpen(false);
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
        <button
          type="button"
          className={styles.themeSwitch}
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label={theme === 'dark' ? 'Dark mode on, switch to light' : 'Light mode on, switch to dark'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <span className={styles.themeSwitchSun} aria-hidden>
            <Sun size={16} strokeWidth={1.8} />
          </span>
          <span className={styles.themeSwitchTrack}>
            <span
              className={`${styles.themeSwitchThumb} ${theme === 'dark' ? styles.themeSwitchThumbDark : ''}`}
              aria-hidden
            />
          </span>
          <span className={styles.themeSwitchMoon} aria-hidden>
            <Moon size={16} strokeWidth={1.8} />
          </span>
        </button>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <Bell size={22} strokeWidth={1.8} />
          <span className={styles.notificationDot} aria-hidden />
        </button>
        <div className={styles.divider} />
        <div className={styles.userDropdown} ref={userDropdownRef}>
          <button
            type="button"
            className={styles.userTrigger}
            onClick={() => setUserDropdownOpen((o) => !o)}
            aria-expanded={userDropdownOpen}
            aria-haspopup="menu"
          >
            <div className={styles.userText}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <ChevronDown size={18} strokeWidth={2} className={`${styles.userChevron} ${userDropdownOpen ? styles.userChevronOpen : ''}`} />
            <div className={styles.avatar}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" />
              ) : (
                <span>{user.name.slice(0, 1)}</span>
              )}
            </div>
          </button>
          {userDropdownOpen && (
            <ul className={styles.userDropdownMenu} role="menu">
              <li>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  role="menuitem"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    navigate(ROUTES.SETTINGS);
                  }}
                >
                  <Settings size={18} strokeWidth={1.8} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
