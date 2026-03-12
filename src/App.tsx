import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks';
import { setMode } from './store/slices/appSlice';
import { MainLayout } from './components';
import HomeAI from './pages/HomeAI';
import HomeStatic from './pages/HomeStatic';
import Placeholder from './pages/Placeholder';
import ResumeBoardPage from './pages/ResumeBoard';
import Settings from './pages/Settings';
import { ROUTES } from './constants';
import './styles/variables.css';
import './App.css';

function ThemeSync({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.app.theme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return <>{children}</>;
}

function ModeSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.app.mode);

  useEffect(() => {
    const path = location.pathname;
    const isStaticRoute =
      path === ROUTES.HOME_STATIC || path === ROUTES.TEAMS || path === ROUTES.RESUME;
    const isAIRoute =
      path === ROUTES.HOME_AI ||
      path === '/' ||
      path === ROUTES.EMPLOYEE_ATTRITION ||
      path === ROUTES.EMPLOYEE_APPROVALS ||
      path === ROUTES.UNSAVED_LAYOUT_1 ||
      path === ROUTES.UNSAVED_LAYOUT_2;
    if (isAIRoute) dispatch(setMode('ai'));
    else if (isStaticRoute) dispatch(setMode('static'));
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (mode === 'ai' && location.pathname === ROUTES.HOME_STATIC) {
      navigate(ROUTES.HOME_AI);
    } else if (mode === 'static' && (location.pathname === ROUTES.HOME_AI || location.pathname === '/')) {
      navigate(ROUTES.HOME_STATIC);
    }
  }, [mode, location.pathname, navigate]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME_AI} element={<HomeAI />} />
      <Route path={ROUTES.HOME_STATIC} element={<HomeStatic />} />
      <Route path={ROUTES.TEAMS} element={<Placeholder title="Teams" />} />
      <Route path={ROUTES.SETTINGS} element={<Settings />} />
      <Route path={ROUTES.RESUME} element={<ResumeBoardPage />} />
      <Route path={ROUTES.EMPLOYEE_ATTRITION} element={<Placeholder title="Employee Attrition" />} />
      <Route path={ROUTES.EMPLOYEE_APPROVALS} element={<Placeholder title="Employee Approvals" />} />
      <Route path={ROUTES.UNSAVED_LAYOUT_1} element={<Placeholder title="Custom Report" />} />
      <Route path={ROUTES.UNSAVED_LAYOUT_2} element={<Placeholder title="Analytics View" />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeSync>
        <BrowserRouter>
          <ModeSync />
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </ThemeSync>
    </Provider>
  );
}

export default App;
