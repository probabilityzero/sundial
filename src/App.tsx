import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Lazy load pages
const Auth = React.lazy(() => import('./pages/Auth'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard')); // Verify path and casing
const CalendarPage = React.lazy(() => import('./pages/Calendar'));
const AnalyticsPage = React.lazy(() => import('./pages/Report'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const TasksPage = React.lazy(() => import('./pages/Tasks'));

function App() {
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout pageTitle="Dashboard"><DashboardPage /></Layout>} />
          <Route path="/profile" element={<Layout pageTitle="Profile"><ProfilePage /></Layout>} />
          <Route path="/calendar" element={<Layout pageTitle="Calendar"><CalendarPage /></Layout>} />
          <Route path="/analytics" element={<Layout pageTitle="History"><AnalyticsPage /></Layout>} />
          <Route path="/tasks" element={<Layout pageTitle="Tasks"><TasksPage /></Layout>} />
          <Route path="/settings" element={<Layout pageTitle="Settings"><SettingsPage /></Layout>} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
