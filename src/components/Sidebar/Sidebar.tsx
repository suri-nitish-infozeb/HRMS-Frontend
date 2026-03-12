import { NavLink, useLocation } from 'react-router-dom';
import { Users, FileText, LayoutDashboard, Home, Settings, PanelLeftClose, PanelLeft, FolderOpen, BarChart2 } from 'lucide-react';
import { SAVED_LAYOUTS, UNSAVED_LAYOUTS, MAIN_MENU_ITEMS, ROUTES } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleSidebar } from '../../store/slices/appSlice';
import styles from './Sidebar.module.css';

const iconMap = {
  users: Users,
  'file-text': FileText,
  'layout-dashboard': LayoutDashboard,
  home: Home,
  settings: Settings,
  folder: FolderOpen,
  'bar-chart': BarChart2,
} as const;

function NavSection({
  title,
  items,
  isActive,
  collapsed,
  separateItemId,
}: {
  title: string;
  items: readonly { id: string; label: string; icon: string; path: string }[];
  isActive: (path: string) => boolean;
  collapsed: boolean;
  separateItemId?: string;
}) {
  return (
    <>
      {!collapsed && <h2 className={styles.sectionTitle}>{title}</h2>}
      <ul className={styles.navList}>
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Users;
          const active = isActive(item.path);
          const isSeparate = separateItemId != null && item.id === separateItemId;
          return (
            <li key={item.id} className={isSeparate ? styles.navItemSeparate : undefined}>
              <NavLink
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive: linkActive }) =>
                  `${styles.navItem} ${linkActive || active ? styles.navItemActive : ''}`
                }
                end={item.path === ROUTES.HOME_STATIC || item.path === ROUTES.HOME_AI}
              >
                <Icon className={styles.navIcon} size={20} strokeWidth={1.8} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.app.mode);
  const collapsed = useAppSelector((state) => state.app.sidebarCollapsed);
  const isAIMode = mode === 'ai';

  const isActiveByPath = (path: string) => location.pathname === path;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span>H</span>
        </div>
        {!collapsed && <span className={styles.logoText}>HRtBeat.ai</span>}
      </div>

      <nav className={styles.nav}>
        {isAIMode ? (
          <>
            <NavSection
              title="UNSAVED LAYOUTS"
              items={UNSAVED_LAYOUTS}
              isActive={isActiveByPath}
              collapsed={collapsed}
            />
            <div className={styles.navSectionBlock}>
              <NavSection
                title="SAVED LAYOUTS"
                items={SAVED_LAYOUTS}
                isActive={isActiveByPath}
                collapsed={collapsed}
                separateItemId="dashboard"
              />
            </div>
          </>
        ) : (
          <NavSection
            title="MAIN MENU"
            items={MAIN_MENU_ITEMS}
            isActive={isActiveByPath}
            collapsed={collapsed}
          />
        )}
      </nav>

      <button
        type="button"
        className={styles.toggle}
        onClick={() => dispatch(toggleSidebar())}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <PanelLeft size={20} strokeWidth={1.8} />
        ) : (
          <PanelLeftClose size={20} strokeWidth={1.8} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;
