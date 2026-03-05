import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { setTheme, toggleTheme } from '../store/slices/appSlice';
import type { Theme } from '../types';

export function useTheme() {
  const theme = useAppSelector((state) => state.app.theme);
  const dispatch = useAppDispatch();

  const set = useCallback(
    (next: Theme) => {
      dispatch(setTheme(next));
    },
    [dispatch]
  );

  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return { theme, setTheme: set, toggleTheme: toggle };
}
