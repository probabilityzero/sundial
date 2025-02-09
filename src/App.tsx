import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';

// Lazy load pages
const Auth = lazy(() => import('./pages/Auth'));
const HomePage = lazy(() => import('./pages/Home'));
const CalendarPage = lazy(() => import('./pages/Calendar'));
const AnalyticsPage = lazy(() => import('./pages/Report'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const TasksPage = lazy(() => import('./pages/Tasks'));

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
    return user ? element : <Navigate to="/auth" />;
  };

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute element={<Layout pageTitle="Home"><HomePage /></Layout>} />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute element={<Layout pageTitle="Profile"><ProfilePage /></Layout>} />
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute element={<Layout pageTitle="Calendar"><CalendarPage /></Layout>} />
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute element={<Layout pageTitle="History"><AnalyticsPage /></Layout>} />
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute element={<Layout pageTitle="Tasks"><TasksPage /></Layout>} />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute element={<Layout pageTitle="Settings"><SettingsPage /></Layout>} />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
