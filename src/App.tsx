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
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      console.log("App: onAuthStateChange - authUser:", authUser);
    };

    fetchUser();

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
          <Route
            path="/"
            element={
              user ? (
                <Layout pageTitle="Home">
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Layout pageTitle="Profile">
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/calendar"
            element={
              user ? (
                <Layout pageTitle="Calendar">
                  <CalendarPage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/analytics"
            element={
              user ? (
                <Layout pageTitle="History">
                  <AnalyticsPage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              user ? (
                <Layout pageTitle="Tasks">
                  <TasksPage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <Layout pageTitle="Settings">
                  <SettingsPage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to home */}
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
