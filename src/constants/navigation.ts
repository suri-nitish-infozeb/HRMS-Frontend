import type { SavedLayout } from '../types';

export const ROUTES = {
  HOME_AI: '/',
  HOME_STATIC: '/home',
  EMPLOYEE_ATTRITION: '/employee-attrition',
  EMPLOYEE_APPROVALS: '/employee-approvals',
  DASHBOARD_HOME: '/', // AI home – same as HOME_AI
  TEAMS: '/teams',
  SETTINGS: '/settings',
  RESUME: '/resume',
  UNSAVED_LAYOUT_1: '/unsaved-layout-1',
  UNSAVED_LAYOUT_2: '/unsaved-layout-2',
  AI_DEVELOPMENT: '/ai-development',
} as const;

export const SAVED_LAYOUTS: SavedLayout[] = [
  { id: 'attrition', label: 'Employee Attrition', icon: 'users', path: ROUTES.EMPLOYEE_ATTRITION },
  { id: 'approvals', label: 'Employee Approvals', icon: 'file-text', path: ROUTES.EMPLOYEE_APPROVALS },
  { id: 'dashboard', label: 'Dashboard Home', icon: 'layout-dashboard', path: ROUTES.HOME_AI },
];

export const UNSAVED_LAYOUTS: SavedLayout[] = [
  { id: 'unsaved-1', label: 'Custom Report', icon: 'folder', path: ROUTES.UNSAVED_LAYOUT_1 },
  { id: 'unsaved-2', label: 'Analytics View', icon: 'bar-chart', path: ROUTES.UNSAVED_LAYOUT_2 },
];

export const MAIN_MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home', path: ROUTES.HOME_STATIC },
  { id: 'teams', label: 'Teams', icon: 'users', path: ROUTES.TEAMS },
  { id: 'settings', label: 'Settings', icon: 'settings', path: ROUTES.SETTINGS },
  {
    id: 'ai-development',
    label: 'AI Development',
    icon: 'file-text',
    path: ROUTES.AI_DEVELOPMENT,
  },
  { id: 'resume', label: 'Resume', icon: 'file-text', path: ROUTES.RESUME },
] as const;