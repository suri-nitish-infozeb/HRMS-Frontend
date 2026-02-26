export type AppMode = 'ai' | 'static';
export type Theme = 'light' | 'dark';

export interface User {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive?: boolean;
}

export interface SavedLayout {
  id: string;
  label: string;
  icon: string;
  path: string;
}
