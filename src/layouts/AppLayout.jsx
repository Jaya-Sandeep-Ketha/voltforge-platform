/**
 * Application Layout Component
 * 
 * Main layout wrapper for the VoltForge application providing consistent
 * structure across all pages. This component manages the sidebar state,
 * content area positioning, and renders the main application shell.
 * 
 * Layout features:
 * - Responsive sidebar with collapse functionality
 * - Smooth transitions between sidebar states
 * - Fixed topbar with dynamic content area
 * - Proper outlet rendering for nested routes
 * - Consistent spacing and background styling
 */

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '@/store/useAppStore';

/**
 * App Layout Component
 * 
 * Provides the main application layout structure with sidebar navigation,
 * topbar header, and dynamic content area. Manages sidebar collapse state
 * and provides smooth animations for layout transitions.
 * 
 * @returns {JSX.Element} Application layout wrapper
 */
export function AppLayout() {
  // Get sidebar collapse state from global store
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Fixed sidebar navigation */}
      <Sidebar />
      
      {/* Main content area with dynamic margin based on sidebar state */}
      <motion.div
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col min-h-screen"
      >
        {/* Fixed topbar header */}
        <Topbar />
        
        {/* Dynamic content area for page routes */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
