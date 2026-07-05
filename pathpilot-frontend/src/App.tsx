import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { LoginPage } from './pages/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/roadmap" element={<DashboardPage />} />
          <Route path="/interview" element={<DashboardPage />} />
          <Route path="/salary" element={<DashboardPage />} />
          <Route path="/resume" element={<DashboardPage />} />
          <Route path="/resources" element={<DashboardPage />} />
          <Route path="/jobs" element={<DashboardPage />} />
          <Route path="/skills" element={<DashboardPage />} />
          <Route path="/settings" element={<DashboardPage />} />
          {/* Add a catch-all to redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
