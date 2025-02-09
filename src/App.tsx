import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase'; // Import supabase

// Lazy load pages
const Auth = lazy(() => import('./pages/Auth'));
const HomePage = lazy(() => import('./pages/Home'));
const CalendarPage = lazy(() => import('./pages/Calendar'));
const AnalyticsPage = lazy(() => import('./pages/Report'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const TasksPage = lazy(() => import('./pages/Tasks'));

function App() {
  const { user, loading, setUser } = useAuthStore(); // Include setUser

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }

    getSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
  }, [setUser]);

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
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
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
