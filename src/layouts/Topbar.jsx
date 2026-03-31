/**
 * Topbar Header Component
 * 
 * Fixed header component providing page title display, search functionality,
 * notifications, and user information. Maintains consistent branding and
 * provides context-aware titles based on current route.
 * 
 * Topbar features:
 * - Dynamic page titles based on current route
 * - Global search functionality with keyboard shortcut
 * - Notification system with visual indicators
 * - User profile display with role information
 * - Responsive design with mobile considerations
 * - Backdrop blur and modern styling
 */

import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Page title mapping configuration
 * Maps route paths to human-readable page titles for display in the header
 * Provides consistent naming across the application
 */
const pageTitles = {
  '/': 'Executive Dashboard',
  '/assets': 'Asset Inventory',
  '/viewer': '3D Service Viewer',
  '/qc': 'QC Validation',
  '/telemetry': 'Telemetry Analytics',
  '/workflows': 'Service Workflows',
  '/health': 'Platform Health',
};

/**
 * Topbar Header Component
 * 
 * Renders the fixed header with dynamic page titles, search functionality,
 * notifications, and user information. Provides context awareness and
 * consistent navigation experience.
 * 
 * @returns {JSX.Element} Topbar header component
 */
export function Topbar() {
  // Get current location for title determination
  const location = useLocation();
  
  // Get notification count from global store
  const notifications = useAppStore((s) => s.notifications);

  // Extract base path for title mapping
  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const title = pageTitles[basePath] || 'VoltForge';

  return (
    <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6">
      {/* Page Title Section */}
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{title}</h1>
        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest">VoltForge Service Tooling</p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Input */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm">
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search assets…</span>
          <kbd className="ml-4 px-1.5 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-500 border border-zinc-700">⌘K</kbd>
        </div>

        {/* Notifications Button */}
        <button className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors">
          <Bell className="h-4.5 w-4.5" />
          {/* Notification indicator dot */}
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* User Profile Section */}
        <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
          {/* User Avatar */}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          
          {/* User Information - Hidden on smaller screens */}
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-zinc-300">Service Engineer</p>
            <p className="text-[10px] text-zinc-600">Demo Mode</p>
          </div>
        </div>
      </div>
    </header>
  );
}
