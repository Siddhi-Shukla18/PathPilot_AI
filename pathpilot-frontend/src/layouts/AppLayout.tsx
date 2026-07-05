import { Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/uiStore';
import { AppSidebar } from '../components/layout/AppSidebar';
import { CommandPalette } from '../components/layout/CommandPalette';

export function AppLayout() {
  const { isAuthenticated } = useUserStore();
  const { sidebarOpen } = useUIStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <AppSidebar variant={sidebarOpen ? 'full' : 'icon'} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Command Palette */}
      <CommandPalette />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(224 18% 13%)',
            color: 'hsl(213 31% 91%)',
            border: '1px solid hsl(224 15% 20%)',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: 'transparent' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'transparent' },
          },
        }}
      />
    </div>
  );
}
