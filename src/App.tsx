import React, { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase';

// Lazy load pages
const Auth = lazy(() => import('./app/Auth'));
const HomePage = lazy(() => import('./app/Home'));
const CalendarPage = lazy(() => import('./app/Calendar'));
const AnalyticsPage = lazy(() => import('./app/Report'));
const SettingsPage = lazy(() => import('./app/Settings'));
const ProfilePage = lazy(() => import('./app/Profile'));
const TasksPage = lazy(() => import('./app/Tasks'));

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--color-background)'
  }}>
    <p style={{ color: 'var(--color-text-primary)' }}>Loading...</p>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { setUser, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setError(error.message);
          setUser(null);
          return;
        }
        
        setUser(session?.user || null);
      } catch (err) {
        console.error("Fatal auth error:", err);
        setError("Authentication system failed to initialize");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  // Show error message if authentication fails
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '0 20px',
        backgroundColor: 'var(--color-background)'
      }}>
        <h2 style={{ color: 'var(--color-error)' }}>Error</h2>
        <p style={{ color: 'var(--color-text-primary)' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth route without Layout */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
