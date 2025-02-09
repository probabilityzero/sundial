import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useSessionStore } from './store/useSessionStore';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase';

// Lazy load pages
const Auth = React.lazy(() => import('./pages/Auth'));
const HomePage = React.lazy(() => import('./pages/Home'));
const CalendarPage = React.lazy(() => import('./pages/Calendar'));
const AnalyticsPage = React.lazy(() => import('./pages/Report'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const TasksPage = React.lazy(() => import('./pages/Tasks'));

function App() {
  const { fetchUserSettings } = useSessionStore();
  const { user, loading, setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("App: onAuthStateChange - event:", event, "session:", session);
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        setUser(session?.user || null);
        console.log("App: onAuthStateChange - setUser with:", session?.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log("App: onAuthStateChange - setUser with null");
      }
    });
  }, [setUser]);

  useEffect(() => {
    if (user) {
      fetchUserSettings(user.id);
    }
  }, [user, fetchUserSettings]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const homeElement = user ? (
    <Layout pageTitle="Home">
      <HomePage />
    </Layout>
  ) : (
    <Navigate to="/auth" />
  );

  const profileElement = user ? (
    <Layout pageTitle="Profile">
      <ProfilePage />
    </Layout>
  ) : (
    <Navigate to="/auth" />
  );

  const calendarElement = user ? (
    <Layout pageTitle="Calendar">
      <CalendarPage />
    </Layout>
  ) : (
    <Navigate to="/auth" />
  );

  const analyticsElement = user ? (
    <Layout pageTitle="History">
      <AnalyticsPage />
    </Layout>
  ) : (
    <Navigate to="/auth" />
  );

  const tasksElement = user ? (
    <Layout pageTitle="Tasks">
      <TasksPage />
    </Layout>
  ) : (
    <Navigate to="/auth" />
  );

  const settingsElement = user ? (
    <Layout pageTitle="Settings">
      <SettingsPage />
    </Layout>
  ) : (
    <Navigate to="/auth" />
  );

  return (
    <Router>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            {console.error("Fallback UI rendered due to Suspense error")}
          </div>
        }
      >
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route path="/" element={homeElement} />
          <Route path="/profile" element={profileElement} />
          <Route path="/calendar" element={calendarElement} />
          <Route path="/analytics" element={analyticsElement} />
          <Route path="/tasks" element={tasksElement} />
          <Route path="/settings" element={settingsElement} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to home */}
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
